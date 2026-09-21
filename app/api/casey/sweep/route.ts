import { runSweep } from "@/lib/sweep";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Catch every conversation Casey had, whether or not she got to log it.
 *
 * Two callers, two keys:
 *   - Vercel Cron, which sends Authorization: Bearer $CRON_SECRET
 *   - anything inside the site, using the same x-casey-key as her tools
 *
 * Both are checked against values that only exist in the environment. With
 * neither set the route refuses rather than running open to the internet.
 */
function authorised(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  const toolKey = process.env.CASEY_TOOL_KEY;

  if (cronSecret && request.headers.get("authorization") === `Bearer ${cronSecret}`) {
    return true;
  }
  if (toolKey && request.headers.get("x-casey-key") === toolKey) {
    return true;
  }
  return false;
}

async function handle(request: Request): Promise<Response> {
  if (!authorised(request)) {
    return new Response("nope", { status: 401 });
  }

  // Cron calls this with no query string, and the daily schedule means the
  // default has to cover more than a day with room to spare. Re-reading a
  // session already written down costs one rejected insert, so the overlap is
  // cheaper than the conversation it would otherwise miss.
  const asked = Number(new URL(request.url).searchParams.get("minutes"));
  const lookbackMinutes =
    Number.isFinite(asked) && asked > 0 ? Math.min(asked, 60 * 24 * 7) : 1500;

  // Backfilling history should not fire a week of alerts at once. Writing the
  // records down is the point; the emails only make sense for conversations
  // Dave has not already seen happen.
  const quiet = new URL(request.url).searchParams.get("quiet") === "1";

  const result = await runSweep({ lookbackMinutes, quiet });

  return Response.json(
    { ok: true, lookbackMinutes, quiet, ...result },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function GET(request: Request): Promise<Response> {
  return handle(request);
}

export async function POST(request: Request): Promise<Response> {
  return handle(request);
}
