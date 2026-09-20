/**
 * Shared front door for Casey's tool endpoints.
 *
 * These routes create calendar events and send email, so they are not open to
 * the internet. Speko attaches a fixed header to every tool call it makes; we
 * check it and nothing else. The value lives only in Vercel's environment and
 * in the tool registration on Speko's side.
 */
export function caseyToolGuard(request: Request): Response | null {
  const expected = process.env.CASEY_TOOL_KEY;
  if (!expected) {
    console.error("CASEY_TOOL_KEY is not set — refusing every tool call");
    return new Response("not configured", { status: 503 });
  }

  const offered = request.headers.get("x-casey-key");
  if (!offered || offered !== expected) {
    return new Response("nope", { status: 401 });
  }

  return null;
}
