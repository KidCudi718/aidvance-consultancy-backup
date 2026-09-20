import { busyBlocks, createEvent } from "@/lib/google-calendar";
import {
  SLOT_MINUTES,
  ZONE,
  isoWithZoneOffset,
  liveOption,
  spokenForInstant,
} from "@/lib/casey-slots";
import { caseyToolGuard } from "@/lib/casey-guard";
import {
  alertDave,
  briefingText,
  confirmToVisitor,
  headline,
  type Briefing,
} from "@/lib/casey-notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Casey books the meeting.
 *
 * Three things happen and they are ordered on purpose:
 *   1. the event goes on Dave's calendar — if this fails, nothing else runs
 *      and Casey is told to take an email instead
 *   2. Dave gets the briefing
 *   3. the visitor gets a confirmation
 * Only step 1 can fail the call. A confirmation email that bounces is worth
 * far less than a meeting that exists, and Casey should not un-book something
 * because a mail server was slow.
 */

type BookBody = {
  when?: string;
  name?: string;
  email?: string;
  phone?: string;
  business?: string;
  location?: string;
  headcount?: string;
  yearsGoing?: string;
  pain?: string;
  hours?: string;
  whoDoesIt?: string;
  trajectory?: string;
  consequence?: string;
  tried?: string;
  authority?: string;
  timing?: string;
  notes?: string;
};

function bad(reply: string): Response {
  return Response.json(
    { booked: false, reply },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request): Promise<Response> {
  const denied = caseyToolGuard(request);
  if (denied) {
    return denied;
  }

  let body: BookBody;
  try {
    body = (await request.json()) as BookBody;
  } catch {
    return bad("Something went wrong booking that. Take their email instead.");
  }

  const name = body.name?.trim();
  if (!name) {
    return bad("I still need their name before I can book anything.");
  }

  const wantsLive = (body.when ?? "").trim().toLowerCase() === "now";
  const now = new Date();

  // Re-check the calendar at the moment of booking. A few minutes of
  // conversation is plenty of time for Dave to have accepted something else.
  let busy;
  try {
    busy = await busyBlocks(
      new Date(now.getTime() - 60_000).toISOString(),
      new Date(now.getTime() + 15 * 86_400_000).toISOString(),
    );
  } catch (error) {
    console.error(
      "Casey booking could not read the calendar",
      error instanceof Error ? error.message : "unknown error",
    );
    return bad(
      "The calendar isn't reachable this second. Take their email and say Dave will confirm a time himself today.",
    );
  }

  let startIso: string;
  let endIso: string;

  if (wantsLive) {
    const live = liveOption(now, busy);
    if (!live.available || !live.startIso || !live.endIso) {
      return bad(
        "Dave just got tied up. Don't promise a call now — offer a time later today instead.",
      );
    }
    startIso = live.startIso;
    endIso = live.endIso;
  } else {
    const startMs = Date.parse(body.when ?? "");
    if (Number.isNaN(startMs)) {
      return bad("I didn't catch which time they picked. Ask them again.");
    }
    const endMs = startMs + SLOT_MINUTES * 60_000;
    const clash = busy.some((block) => {
      const blockStart = Date.parse(block.start);
      const blockEnd = Date.parse(block.end);
      return !Number.isNaN(blockStart) && startMs < blockEnd && endMs > blockStart;
    });
    if (clash) {
      return bad("That one just went. Offer them the other time instead.");
    }
    startIso = isoWithZoneOffset(new Date(startMs));
    endIso = isoWithZoneOffset(new Date(endMs));
  }

  const brief: Briefing = {
    name,
    business: body.business,
    location: body.location,
    headcount: body.headcount,
    yearsGoing: body.yearsGoing,
    pain: body.pain,
    hours: body.hours,
    whoDoesIt: body.whoDoesIt,
    trajectory: body.trajectory,
    consequence: body.consequence,
    tried: body.tried,
    authority: body.authority,
    timing: body.timing,
    phone: body.phone,
    email: body.email,
    notes: body.notes,
  };

  let event: { id: string; link: string };
  try {
    event = await createEvent({
      summary: `${wantsLive ? "Call now" : "15 min"} — ${headline(brief)}`,
      description: briefingText(brief),
      startIso,
      endIso,
      timeZone: ZONE,
    });
  } catch (error) {
    console.error(
      "Casey could not create the event",
      error instanceof Error ? error.message : "unknown error",
    );
    return bad(
      "I couldn't get that onto the calendar. Take their email and say Dave will confirm himself today.",
    );
  }

  const spokenTime = wantsLive ? "in a few minutes" : spokenForInstant(new Date(startIso), now);

  // Neither email can fail the booking — the meeting existing matters more.
  const [daveTold, visitorTold] = await Promise.all([
    alertDave({ brief, live: wantsLive, spokenTime, eventLink: event.link }),
    confirmToVisitor({ brief, live: wantsLive, spokenTime }),
  ]);

  if (!daveTold) {
    console.error("Booking created but Dave was not emailed", event.id);
  }

  return Response.json(
    {
      booked: true,
      live: wantsLive,
      startIso,
      confirmationEmailed: visitorTold,
      reply: wantsLive
        ? "Done — Dave has it and he's calling them in the next few minutes. Tell them that, tell them roughly how long it'll be, and say goodbye warmly."
        : `Done — it's on his calendar for ${spokenTime}. Say it back to them once so they've heard it, mention the confirmation email${visitorTold ? "" : " is coming from Dave shortly"}, and close warmly.`,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
