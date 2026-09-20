/**
 * Read-side client for Speko's sessions API.
 *
 * The site already mints sessions with SPEKO_API_KEY in app/api/voice/session.
 * This is the other half: reading back what happened once a conversation is
 * over. Same host, same bearer, no new credentials.
 *
 * Endpoints are the ones Speko's own MCP server calls:
 *   GET /v1/sessions?agent=&status=&kind=&from=&to=&limit=
 *   GET /v1/sessions/{id}/transcript
 */

const API_BASE = "https://api.speko.dev";

export type SpekoSession = {
  id: string;
  status: string;
  kind: string;
  createdAt: string;
  endedAt: string | null;
  durationSeconds: number | null;
  agentId: string;
  /** True for platform-run simulations. Never a real visitor. */
  gate?: boolean;
  /** Set when the session belongs to an automated eval run. */
  evalRunId?: string | null;
  simKind?: string | null;
};

export type TranscriptEntry = {
  index: number;
  source: "agent" | "user" | string;
  text: string;
  startedAt: string | null;
  toolCalls?: Array<{ name?: string; args?: unknown }> | null;
};

function key(): string | null {
  return process.env.SPEKO_API_KEY ?? null;
}

async function get<T>(path: string): Promise<T | null> {
  const apiKey = key();
  if (!apiKey) {
    console.error("Speko read skipped: SPEKO_API_KEY is not set");
    return null;
  }

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Speko read failed", path, response.status, await response.text());
      return null;
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error(
      "Speko read threw",
      path,
      error instanceof Error ? error.message : "unknown error",
    );
    return null;
  }
}

/** Ended sessions for one agent since a given instant, newest first. */
export async function listEndedSessions(args: {
  agentId: string;
  since: Date;
  limit?: number;
}): Promise<SpekoSession[]> {
  const query = new URLSearchParams({
    agent: args.agentId,
    status: "ended",
    kind: "s2s",
    from: args.since.toISOString(),
    limit: String(args.limit ?? 50),
  });

  const page = await get<{ entries?: SpekoSession[] }>(`/v1/sessions?${query}`);
  return page?.entries ?? [];
}

/**
 * The ordered transcript for one session.
 *
 * Speko wraps this as { kind, data: { entries } }; older responses have
 * returned a bare { entries }. Accept either rather than depend on the shape.
 */
export async function getTranscript(sessionId: string): Promise<TranscriptEntry[]> {
  const body = await get<
    { entries?: TranscriptEntry[] } | { data?: { entries?: TranscriptEntry[] } }
  >(`/v1/sessions/${encodeURIComponent(sessionId)}/transcript`);

  if (!body) {
    return [];
  }
  if ("entries" in body && Array.isArray(body.entries)) {
    return body.entries;
  }
  if ("data" in body && Array.isArray(body.data?.entries)) {
    return body.data.entries;
  }
  return [];
}
