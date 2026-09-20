import { busyBlocks } from "@/lib/google-calendar";
import { liveOption, openSlots, searchWindow } from "@/lib/casey-slots";
import { caseyToolGuard } from "@/lib/casey-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * "Is Dave about?" — called by Casey mid-conversation.
 *
 * Returns spoken strings, not timestamps. Casey reads them out verbatim and
 * hands back the opaque slot id when someone picks one, so she never has to
 * reason about dates, timezones or daylight saving. She is not good at those
 * and there is no reason to make her try.
 *
 * Failure is deliberately soft: if Google is unreachable, she is told the
 * calendar is unavailable and falls back to taking an email. A visitor should
 * never hear an error, only a human-sounding alternative.
 */
export async function POST(request: Request): Promise<Response> {
  const denied = caseyToolGuard(request);
  if (denied) {
    return denied;
  }

  const now = new Date();
  const window = searchWindow(now);

  let busy;
  try {
    busy = await busyBlocks(window.fromIso, window.toIso);
  } catch (error) {
    console.error(
      "Casey availability lookup failed",
      error instanceof Error ? error.message : "unknown error",
    );
    return Response.json(
      {
        calendarReachable: false,
        daveFreeNow: false,
        slots: [],
        guidance:
          "The calendar isn't reachable right now. Don't offer any times. Take their email instead and say Dave will come back to them personally today.",
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const live = liveOption(now, busy);
  const slots = openSlots(now, busy);

  return Response.json(
    {
      calendarReachable: true,
      daveFreeNow: live.available,
      liveCall: live.available
        ? { spoken: live.spoken, startIso: live.startIso }
        : null,
      slots: slots.map((slot) => ({ id: slot.id, spoken: slot.spoken })),
      guidance: live.available
        ? "Dave is free. Offer the call now first, exactly as written in your close. If they'd rather not, offer the first two slots."
        : slots.length > 0
          ? "Dave is not free this minute. Do not say he is. Offer the first two slots by their spoken text."
          : "Nothing is open in the next two weeks. Take their email and say Dave will come back with times himself.",
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
