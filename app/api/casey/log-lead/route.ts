import { after } from "next/server";
import { caseyToolGuard } from "@/lib/casey-guard";
import { saveLead, type LeadRow } from "@/lib/leads";
import { alertDave, type Briefing } from "@/lib/casey-notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Casey's last act on every conversation, whatever happened.
 *
 * This is the only writer of lead rows. A booked conversation is logged here
 * too, with outcome "booked", so a single conversation can never arrive as two
 * records — one from the booking and one orphan from the close.
 *
 * She is told to call it even when the answer was no. Especially then.
 */

type Body = LeadRow;

export async function POST(request: Request): Promise<Response> {
  const denied = caseyToolGuard(request);
  if (denied) {
    return denied;
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return Response.json({ saved: false, reply: "Noted. Carry on." });
  }

  const outcome: LeadRow["outcome"] =
    body.outcome === "booked" || body.outcome === "email"
      ? body.outcome
      : "conversation";

  const row: LeadRow = { ...body, outcome };

  after(async () => {
    await saveLead(row);

    // A booking already sent Dave a briefing when the event was created.
    // Anything else is the quiet lead he would otherwise never hear about,
    // so that is the one worth a ping.
    if (outcome !== "booked" && row.name) {
      const brief: Briefing = {
        name: row.name,
        business: row.business,
        location: row.location,
        headcount: row.headcount,
        yearsGoing: row.years_going,
        pain: row.pain,
        hours: row.hours,
        whoDoesIt: row.who_does_it,
        trajectory: row.trajectory,
        consequence: row.consequence,
        tried: row.tried,
        authority: row.authority,
        timing: row.timing,
        phone: row.phone,
        email: row.email,
        notes: row.notes,
      };
      await alertDave({ brief, kind: outcome === "email" ? "email" : "conversation" });
    }
  });

  // Whatever happens behind the scenes, she hears the same thing: nothing to
  // say out loud. The visitor must never learn that a database exists.
  return Response.json(
    { saved: true, reply: "Noted. Say nothing about this — just close warmly." },
    { headers: { "Cache-Control": "no-store" } },
  );
}
