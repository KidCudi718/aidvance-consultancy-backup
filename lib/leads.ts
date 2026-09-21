/**
 * The lead book.
 *
 * One row per conversation that got far enough to be worth knowing about —
 * deliberately not one row per booking. A visitor who talks for five minutes,
 * takes the guide and says "let me think about it" is the single most callable
 * lead on the site, and before this he left no trace at all.
 *
 * Writes go through PostgREST with Supabase's anon key. That key is public by
 * design; the protection is row-level security, which permits insert and
 * update on this one table and no reads whatsoever. If it leaked tomorrow the
 * worst anyone could do is add junk rows to a table only Dave can read.
 *
 * A plain insert, never an upsert. PostgREST resolves an upsert by first
 * looking for the row it would collide with, which needs SELECT — and SELECT
 * is the one thing this key must not have. Nothing needs upsert semantics
 * here: log_conversation is the only writer and it runs once per conversation.
 */

export type LeadRow = {
  session_id?: string;
  name?: string;
  email?: string;
  phone?: string;
  business?: string;
  location?: string;
  headcount?: string;
  years_going?: string;
  category?: string;
  pain?: string;
  hours?: string;
  who_does_it?: string;
  trajectory?: string;
  consequence?: string;
  tried?: string;
  authority?: string;
  timing?: string;
  notes?: string;
  outcome?: "conversation" | "email" | "booked";
  booked_for?: string;
  calendar_event_id?: string;
  duration_seconds?: number;
};

function trimmed(row: LeadRow): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    if (value === undefined || value === null) {
      continue;
    }
    if (typeof value === "string" && value.trim() === "") {
      continue;
    }
    out[key] = typeof value === "string" ? value.trim() : value;
  }
  return out;
}

/**
 * Save a lead. Never throws — a database having a bad afternoon must not cost
 * Casey a booking or leave a visitor listening to silence.
 */
export async function saveLead(row: LeadRow): Promise<boolean> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    console.error("Lead not saved — Supabase is not configured");
    return false;
  }

  const body = trimmed(row);
  if (Object.keys(body).length === 0) {
    return false;
  }

  try {
    const response = await fetch(`${url}/rest/v1/aidvance_lead`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error("Lead not saved", response.status, await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error(
      "Lead write threw",
      error instanceof Error ? error.message : "unknown error",
    );
    return false;
  }
}
