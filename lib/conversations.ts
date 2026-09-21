import type { ConversationRecord } from "@/lib/conversation-record";

/**
 * The conversation book.
 *
 * Every conversation Casey has, whatever it was worth, written down after the
 * fact from the transcript. aidvance_lead holds her own structured read when
 * she manages one; this holds the raw truth either way.
 *
 * Same key and the same row-level security as the lead table: insert only, no
 * select, no update. session_id carries a unique constraint, so re-running the
 * sweep over a window that overlaps an earlier one is free rather than
 * dangerous. A duplicate comes back as 409 and is not an error.
 */

export type SaveResult = "saved" | "duplicate" | "failed";

export async function saveConversation(
  record: ConversationRecord,
): Promise<SaveResult> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    console.error("Conversation not saved — Supabase is not configured");
    return "failed";
  }

  try {
    const response = await fetch(`${url}/rest/v1/aidvance_conversation`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(record),
    });

    if (response.status === 409) {
      return "duplicate";
    }
    if (!response.ok) {
      console.error(
        "Conversation not saved",
        response.status,
        await response.text(),
      );
      return "failed";
    }
    return "saved";
  } catch (error) {
    console.error(
      "Conversation write threw",
      error instanceof Error ? error.message : "unknown error",
    );
    return "failed";
  }
}
