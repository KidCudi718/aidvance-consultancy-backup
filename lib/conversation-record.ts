import { resolveCategory } from "@/lib/casey";
import type { SpekoSession, TranscriptEntry } from "@/lib/speko-sessions";

/**
 * Turning a finished conversation into something Dave can act on.
 *
 * Casey's own log_conversation call is the richer record when it lands: she
 * was in the room and heard the nuance. But it depends on the conversation
 * ending politely enough for her to get one last tool call away, and real
 * conversations end when someone's phone rings.
 *
 * So this exists as the floor, not the ceiling. Whatever else happens, every
 * conversation leaves a verbatim record and Dave gets told about it. Nothing
 * here guesses: every field is either lifted straight out of the transcript or
 * left empty.
 */

export type ConversationRecord = {
  session_id: string;
  started_at: string;
  duration_seconds: number;
  /** The visitor's name, only when Casey repeated it back. */
  name?: string;
  email?: string;
  phone?: string;
  /** One of the nine, only when Casey said the label out loud. */
  category?: string;
  outcome: "booked" | "email" | "conversation";
  /** Every turn, verbatim, oldest first. The record of last resort. */
  transcript: string;
  turn_count: number;
};

/**
 * Conversations too short or too synthetic to be worth Dave's attention.
 *
 * Platform evals and simulations are not people. Neither is a visitor who
 * pressed the button, heard the greeting and closed the tab: there is nothing
 * in it to act on, and mailing Dave about it teaches him to ignore the alerts.
 */
export function isWorthLogging(
  session: SpekoSession,
  entries: readonly TranscriptEntry[],
): boolean {
  if (session.gate === true || session.evalRunId) {
    return false;
  }
  const userTurns = entries.filter((entry) => entry.source === "user");
  if (userTurns.length < 2) {
    return false;
  }
  const spoken = userTurns.map((turn) => turn.text.trim()).join(" ");
  // Two turns of "yeah" and a throat clear is not a conversation.
  return spoken.replace(/\s+/g, " ").length >= 25;
}

const SPELLED_DOMAINS = [
  "com",
  "net",
  "org",
  "co",
  "io",
  "us",
  "biz",
  "info",
  "edu",
  "gov",
];

/**
 * Find an email address in what the visitor said.
 *
 * People speak addresses out loud, so "dave at gmail dot com" has to count as
 * much as a typed one. Only the visitor's own turns are searched: Casey
 * repeating an address back is not a second address.
 */
export function findEmail(userText: string): string | undefined {
  const typed = userText.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  if (typed) {
    return typed[0].toLowerCase();
  }

  const spoken = userText
    .toLowerCase()
    .match(
      new RegExp(
        `([\\w.+-]+)\\s+at\\s+([\\w-]+)\\s+dot\\s+(${SPELLED_DOMAINS.join("|")})\\b`,
      ),
    );
  if (spoken) {
    return `${spoken[1]}@${spoken[2]}.${spoken[3]}`;
  }
  return undefined;
}

/** A US-shaped phone number, spoken or typed. */
export function findPhone(userText: string): string | undefined {
  const match = userText.match(
    /(\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/,
  );
  return match ? match[0].trim() : undefined;
}

/**
 * The name, only when Casey echoed it back.
 *
 * Her script has her greet by name, so her own words are the reliable place to
 * read it. Taking it from the visitor's turn instead would pick up whatever
 * else was in the sentence. She does mishear sometimes, which is exactly why
 * the full transcript travels with every record.
 */
export function findName(agentText: string): string | undefined {
  // Case-folded on the greeting but not on the name: the capital letter is
  // what separates a name from "you" in "good to meet you too".
  const match = agentText.match(
    /(?:[Gg]ood|[Gg]reat|[Nn]ice)\s+to\s+meet\s+you,?\s+([A-Z][a-zA-Z'-]{1,20})/,
  );
  return match ? match[1] : undefined;
}

function calledTool(entries: readonly TranscriptEntry[], name: string): boolean {
  return entries.some((entry) =>
    (entry.toolCalls ?? []).some((call) => call?.name === name),
  );
}

export function distill(
  session: SpekoSession,
  entries: readonly TranscriptEntry[],
): ConversationRecord {
  const ordered = [...entries].sort((a, b) => a.index - b.index);
  const userText = ordered
    .filter((entry) => entry.source === "user")
    .map((entry) => entry.text)
    .join(" ");
  const agentTurns = ordered
    .filter((entry) => entry.source === "agent")
    .map((entry) => entry.text);

  const email = findEmail(userText);
  const booked = calledTool(ordered, "book_meeting");

  const category = resolveCategory(agentTurns);

  return {
    session_id: session.id,
    started_at: session.createdAt,
    duration_seconds: session.durationSeconds ?? 0,
    name: findName(agentTurns.join(" ")),
    email,
    phone: findPhone(userText),
    category: category ?? undefined,
    outcome: booked ? "booked" : email ? "email" : "conversation",
    transcript: ordered
      .map((entry) => `${entry.source === "agent" ? "Casey" : "Them"}: ${entry.text.trim()}`)
      .join("\n"),
    turn_count: ordered.length,
  };
}
