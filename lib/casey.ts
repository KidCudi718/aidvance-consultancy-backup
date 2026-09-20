import type { PickerKey } from "@/lib/verdict";

/**
 * Casey — the voice agent in the homepage hero.
 *
 * She is the spoken version of the picker, not a second front door. Everything
 * she resolves is fed back into the existing verdict band via lib/verdict.ts,
 * so there is exactly one copy of the verdict text on the site.
 */

/**
 * Hard stop on a single conversation, also enforced server-side via ttlSeconds.
 *
 * This is sized for a real conversation, not for rationing. A proper
 * qualification plus the close runs four to five minutes; three minutes cut her
 * off mid-recommendation, which wastes the whole conversation. At $0.09/min the
 * difference is pennies — the cap is here for abandoned tabs and bots.
 */
export const CASEY_MAX_SESSION_SECONDS = 360;

/**
 * When to tell her time is short. A full minute of runway, so she can finish
 * the thought she is on and still close properly.
 */
export const CASEY_WRAP_UP_SECONDS = 300;

/**
 * Casey is told to say one of these labels verbatim when she confirms which
 * category is eating the visitor's week. Matching on her spoken words keeps the
 * integration inside the documented @spekoai/client surface (onTranscript) —
 * no undocumented tool-call channel, and the sentence still sounds natural.
 *
 * Order matters: longer, more specific phrases are tested first so that
 * "retyping the same information" cannot be swallowed by a looser match.
 */
const CATEGORY_PHRASES: ReadonlyArray<{ key: PickerKey; phrases: string[] }> = [
  {
    key: "admin",
    phrases: [
      "paperwork, data entry, retyping the same information",
      "retyping the same information",
      "paperwork, data entry",
    ],
  },
  {
    key: "quote",
    phrases: ["quotes, estimates and proposals", "quotes, estimates"],
  },
  {
    key: "faq",
    phrases: ["answering the same questions"],
  },
  {
    key: "sched",
    phrases: ["scheduling and chasing people"],
  },
  {
    key: "train",
    phrases: ["training people, repeating myself"],
  },
  {
    key: "other",
    phrases: ["something else"],
  },
];

function normalise(text: string): string {
  return text
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Pull the category Casey landed on out of what she has said so far.
 * Only her turns count — the visitor saying "quotes" is not a confirmation.
 */
export function resolveCategory(
  caseyTurns: readonly string[],
): PickerKey | null {
  const said = normalise(caseyTurns.join(" "));
  if (!said) {
    return null;
  }

  for (const { key, phrases } of CATEGORY_PHRASES) {
    for (const phrase of phrases) {
      if (said.includes(normalise(phrase))) {
        return key;
      }
    }
  }

  return null;
}

/** Human-readable reason a session could not start, for the status line. */
export type CaseyBlockReason = "mic-denied" | "unavailable" | "busy";

export const CASEY_BLOCK_COPY: Record<CaseyBlockReason, string> = {
  "mic-denied":
    "No microphone, no problem — pick from the list instead. It gets you the same answer.",
  unavailable:
    "Casey is offline right now. The list below does the same job.",
  busy: "Casey is busy at the moment. Have a go at the list instead.",
};
