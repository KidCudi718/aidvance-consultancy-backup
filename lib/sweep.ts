import { distill, isWorthLogging } from "@/lib/conversation-record";
import { saveConversation } from "@/lib/conversations";
import { alertDave, type Briefing } from "@/lib/casey-notify";
import { getTranscript, listEndedSessions } from "@/lib/speko-sessions";
import { pickerRows, type PickerKey } from "@/lib/verdict";

/**
 * The post-call sweep.
 *
 * Casey's own log_conversation call happens while she is still talking, with a
 * three second budget, at the exact moment a visitor is most likely to hang
 * up. When it lands it is the better record. When it does not, this is what
 * stands between Dave and never knowing someone called.
 *
 * It reads finished sessions from Speko, writes each one down verbatim, and
 * mails him the ones with a person on the other end. Running it twice over the
 * same window is free: session_id is unique, so a second pass is all 409s.
 */

export type SweepResult = {
  scanned: number;
  logged: number;
  skipped: number;
  duplicates: number;
  failed: number;
};

const LABELS = new Map<PickerKey, string>(
  pickerRows.map((row) => [row.key, row.label]),
);

function briefFrom(record: ReturnType<typeof distill>): Briefing {
  return {
    // Casey greets by name, so a blank here usually means they never gave one.
    name: record.name ?? "Someone who didn't give a name",
    pain: record.category
      ? LABELS.get(record.category as PickerKey) ?? record.category
      : undefined,
    email: record.email,
    phone: record.phone,
    transcript: record.transcript,
  };
}

/**
 * Sweep everything that ended in the last `lookbackMinutes`.
 *
 * The window deliberately overlaps previous runs. Speko marks a session ended
 * a little after the last word is spoken, so a tight window drops exactly the
 * conversations that ran up to the wire.
 */
export async function runSweep(
  args: { lookbackMinutes?: number } = {},
): Promise<SweepResult> {
  const agentId = process.env.SPEKO_AGENT_ID;
  const result: SweepResult = {
    scanned: 0,
    logged: 0,
    skipped: 0,
    duplicates: 0,
    failed: 0,
  };

  if (!agentId) {
    console.error("Sweep skipped: SPEKO_AGENT_ID is not set");
    return result;
  }

  const lookback = args.lookbackMinutes ?? 90;
  const since = new Date(Date.now() - lookback * 60 * 1000);
  const sessions = await listEndedSessions({ agentId, since });
  result.scanned = sessions.length;

  for (const session of sessions) {
    // Cheap rejection first, so an eval run costs no transcript fetches.
    if (session.gate === true || session.evalRunId) {
      result.skipped += 1;
      continue;
    }

    const entries = await getTranscript(session.id);
    if (!isWorthLogging(session, entries)) {
      result.skipped += 1;
      continue;
    }

    const record = distill(session, entries);
    const saved = await saveConversation(record);

    if (saved === "duplicate") {
      result.duplicates += 1;
      continue;
    }
    if (saved === "failed") {
      result.failed += 1;
      continue;
    }

    result.logged += 1;

    // A booking already mailed him a full briefing when the event was made.
    // Mailing again would train him to skim the ones that matter.
    if (record.outcome !== "booked") {
      await alertDave({
        brief: briefFrom(record),
        kind: record.outcome === "email" ? "email" : "conversation",
      });
    }
  }

  return result;
}
