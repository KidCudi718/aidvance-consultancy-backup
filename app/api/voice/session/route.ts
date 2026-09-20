export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Mints a short-lived Speko voice session for the browser.
 *
 * SPEKO_API_KEY stays on the server. The browser only ever receives the
 * transportToken / transportUrl pair, which expires on its own.
 *
 * The real risk with a public voice agent is not the per-minute rate, it is an
 * open tab or a bot looping it. Three limits, all enforced here:
 *   - ttlSeconds, so a session cannot outlive its welcome server-side
 *   - a short cooldown per caller, so one visitor cannot loop it
 *   - a hard ceiling on sessions per day
 * When a limit trips the caller gets a clean 429 and the page quietly falls
 * back to the grid of problems. Nobody sees an error.
 */

// Sits just past the 360s client-side stop, so the client always ends the
// conversation deliberately rather than having the token die underneath it.
const SESSION_TTL_SECONDS = 420;

/**
 * How long one visitor waits before they can start again.
 *
 * This exists to stop abandoned tabs and bots looping the agent, not to ration
 * real people. An hour punished the wrong person: someone whose call dropped,
 * or whose phone rang mid-conversation, could not come back for the rest of
 * the hour. Twenty minutes still costs a bot almost everything and costs a
 * genuine visitor almost nothing.
 */
const PER_CALLER_COOLDOWN_MS = 20 * 60 * 1000;
const DAILY_SESSION_CEILING = Number(process.env.CASEY_DAILY_LIMIT ?? 120);

type Bucket = { day: string; count: number };

const lastSeen = new Map<string, number>();
const daily: Bucket = { day: "", count: 0 };

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function callerKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]!.trim();
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

function sweep(now: number): void {
  for (const [key, seen] of lastSeen) {
    if (now - seen > PER_CALLER_COOLDOWN_MS) {
      lastSeen.delete(key);
    }
  }
}

type Minted = { transportToken: string; transportUrl: string };

/**
 * One attempt at POST /v1/sessions.
 *
 * The Idempotency-Key is required whenever the session points at a
 * speech-to-speech agent: it lets a bootstrap that times out be retried without
 * quietly opening a second session. Each attempt gets its own key, because a
 * retry in a different mode is a genuinely different request.
 */
async function mint(
  apiKey: string,
  body: Record<string, unknown>,
): Promise<{ ok: true; data: Minted } | { ok: false; status: number; detail: string }> {
  const response = await fetch("https://api.speko.dev/v1/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": crypto.randomUUID(),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    return { ok: false, status: response.status, detail: detail.slice(0, 500) };
  }

  const payload = (await response.json()) as Partial<Minted>;
  if (!payload.transportToken || !payload.transportUrl) {
    return { ok: false, status: 502, detail: "missing transport credentials" };
  }

  return {
    ok: true,
    data: {
      transportToken: payload.transportToken,
      transportUrl: payload.transportUrl,
    },
  };
}

/**
 * Speko marks some refusals retryable, notably when its provider-direct
 * speech-to-speech bootstrap is unavailable. Cascade assembles the same call
 * out of separate speech, model and voice providers and keeps working, so a
 * retryable refusal is worth one more attempt rather than an apology.
 */
function worthRetryingInCascade(status: number, detail: string): boolean {
  if (detail.includes("S2S_SESSION_PLAN_UNAVAILABLE")) {
    return true;
  }
  if (detail.includes('"retryable":true')) {
    return true;
  }
  return status >= 500;
}

export async function POST(request: Request): Promise<Response> {
  const apiKey = process.env.SPEKO_API_KEY;
  const agentId = process.env.SPEKO_AGENT_ID;

  if (!apiKey || !agentId) {
    // Not configured yet, the page falls back to the grid.
    return new Response("voice not configured", { status: 503 });
  }

  const now = Date.now();
  sweep(now);

  if (daily.day !== today()) {
    daily.day = today();
    daily.count = 0;
  }
  if (daily.count >= DAILY_SESSION_CEILING) {
    return new Response("daily ceiling reached", { status: 429 });
  }

  const caller = callerKey(request);
  const seen = lastSeen.get(caller);
  if (seen && now - seen < PER_CALLER_COOLDOWN_MS) {
    return new Response("already had a turn", { status: 429 });
  }

  const base = {
    agentId,
    ttlSeconds: SESSION_TTL_SECONDS,
    metadata: { surface: "aidvance-homepage" },
  };

  let result;
  try {
    // First choice: whatever run mode the agent itself is set to.
    result = await mint(apiKey, base);

    if (!result.ok && worthRetryingInCascade(result.status, result.detail)) {
      console.warn(
        "Speko refused the agent's own run mode, retrying in cascade",
        result.status,
        result.detail,
      );
      result = await mint(apiKey, { ...base, mode: "cascade" });
    }
  } catch (error) {
    console.error(
      "Speko session mint failed",
      error instanceof Error ? error.message : "unknown error",
    );
    return new Response("voice unavailable", { status: 503 });
  }

  if (!result.ok) {
    console.error("Speko session rejected", result.status, result.detail);
    return new Response("voice unavailable", { status: 503 });
  }

  lastSeen.set(caller, now);
  daily.count += 1;

  return Response.json(result.data, {
    headers: { "Cache-Control": "no-store" },
  });
}
