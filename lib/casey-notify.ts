/**
 * Everything a human reads after Casey finishes a conversation.
 *
 * Emails are sent by us rather than by Google. That is not a workaround for
 * its own sake: a service account cannot send Google's invitations without
 * domain-wide delegation, and sending them ourselves means the visitor gets
 * mail from aidvance.xyz instead of a personal Gmail address. Better outcome
 * for the reason we would have wanted anyway.
 */

const RESEND_URL = "https://api.resend.com/emails";

/** What happened at the end of the conversation. Drives subject and opening. */
export type AlertKind = "live" | "booked" | "email" | "conversation";

export type Briefing = {
  name: string;
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
  phone?: string;
  email?: string;
  notes?: string;
};

function line(label: string, value: string | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) {
    return null;
  }
  return `${label}: ${trimmed}`;
}

/** The one-line version, for a subject line or a phone notification. */
export function headline(brief: Briefing): string {
  const bits = [brief.name.trim()];
  if (brief.business?.trim()) {
    bits.push(brief.business.trim());
  }
  if (brief.location?.trim()) {
    bits.push(brief.location.trim());
  }
  return bits.join(" — ");
}

/**
 * The bit Dave actually reads thirty seconds before he dials.
 *
 * Written as prose rather than a form, because he is reading it on a phone
 * while walking to a quiet room, not filing it.
 */
export function briefingText(brief: Briefing): string {
  const opening = [
    `You're about to talk to ${brief.name.trim()}.`,
    brief.business?.trim() ? `They run ${brief.business.trim()}.` : null,
    brief.location?.trim() ? `Based in ${brief.location.trim()}.` : null,
  ]
    .filter(Boolean)
    .join(" ");

  const detail = [
    line("Size", brief.headcount),
    line("How long going", brief.yearsGoing),
    line("Biggest time sink", brief.pain),
    line("Hours a week on it", brief.hours),
    line("Who does it", brief.whoDoesIt),
    line("Getting worse?", brief.trajectory),
    line("What it costs them", brief.consequence),
    line("Already tried", brief.tried),
    line("Who decides", brief.authority),
    line("Timing", brief.timing),
  ].filter((entry): entry is string => Boolean(entry));

  const reach = [
    line("Phone", brief.phone),
    line("Email", brief.email),
  ].filter((entry): entry is string => Boolean(entry));

  const sections = [opening];
  if (detail.length > 0) {
    sections.push(detail.join("\n"));
  }
  if (reach.length > 0) {
    sections.push(reach.join("\n"));
  }
  if (brief.notes?.trim()) {
    sections.push(`In their own words: ${brief.notes.trim()}`);
  }

  return sections.join("\n\n");
}

async function send(args: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Casey wanted to send mail but RESEND_API_KEY is not set");
    return false;
  }

  const from =
    process.env.CASEY_FROM?.trim() ||
    process.env.CONTACT_FROM?.trim() ||
    "Casey at A.I. Advance <onboarding@resend.dev>";

  try {
    const response = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [args.to],
        subject: args.subject,
        text: args.text,
        ...(args.replyTo ? { reply_to: args.replyTo } : {}),
      }),
    });

    if (!response.ok) {
      console.error("Resend rejected a Casey email", response.status, await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error(
      "Casey email threw",
      error instanceof Error ? error.message : "unknown error",
    );
    return false;
  }
}

export function daveInbox(): string {
  return (
    process.env.DAVE_INBOX?.trim() ||
    process.env.CONTACT_INBOX?.trim() ||
    "david.choukroun2@gmail.com"
  );
}

/**
 * Tell Dave.
 *
 * The subject has to carry the whole verdict on its own, because that is all
 * he sees on a lock screen and it decides whether he opens it now or later.
 * Someone waiting on a call this minute must not read like someone who took
 * a guide and wandered off.
 */
export async function alertDave(args: {
  brief: Briefing;
  kind: AlertKind;
  /** Only meaningful when kind is "booked". */
  spokenTime?: string;
  eventLink?: string;
}): Promise<boolean> {
  const who = headline(args.brief);
  const phoneSuffix = args.brief.phone ? ` · ${args.brief.phone}` : "";

  let subject: string;
  let opening: string;

  switch (args.kind) {
    case "live":
      subject = `CALL NOW — ${who}${phoneSuffix}`;
      opening =
        "Casey just told them you'd call in the next few minutes. They are waiting.";
      break;
    case "booked":
      subject = `Booked ${args.spokenTime ?? ""} — ${who}`.replace("  ", " ");
      opening = `Casey booked this for ${args.spokenTime ?? "a time on your calendar"}.`;
      break;
    case "email":
      subject = `Lead — took the guide, no call yet — ${who}`;
      opening =
        "No meeting. She handed over the guide and got their email, and they wanted to read it first. Worth a call in a few days — this is the one you would never have heard about.";
      break;
    default:
      subject = `Lead — talked, didn't book — ${who}`;
      opening =
        "No meeting and no email. They talked, then left. Everything she got is below, in case it is worth chasing.";
      break;
  }

  const text = [
    opening,
    "",
    briefingText(args.brief),
    args.eventLink ? `\nOn your calendar: ${args.eventLink}` : "",
  ].join("\n");

  return send({
    to: daveInbox(),
    subject,
    text,
    replyTo: args.brief.email?.trim() || undefined,
  });
}

/** Tell the visitor, in Casey's voice rather than a system's. */
export async function confirmToVisitor(args: {
  brief: Briefing;
  live: boolean;
  spokenTime: string;
}): Promise<boolean> {
  const email = args.brief.email?.trim();
  if (!email) {
    return false;
  }

  const first = args.brief.name.trim().split(/\s+/)[0] || "there";

  const text = args.live
    ? [
        `Hi ${first},`,
        "",
        "Dave's going to call you in the next few minutes — this is just so you",
        "have it in writing, and so you know the number that rings isn't spam.",
        "",
        "Fifteen minutes, no obligation, and he'll tell you straight if the answer",
        "isn't worth paying for.",
        "",
        "If he doesn't reach you, reply to this and we'll find another time.",
        "",
        "— Casey",
        "A.I. Advance Consultancy",
      ].join("\n")
    : [
        `Hi ${first},`,
        "",
        `You're down for fifteen minutes with Dave ${args.spokenTime}.`,
        "",
        "He'll call you. No prep needed — he'll ask how the work actually gets",
        "done and tell you straight where AI helps and where it honestly doesn't.",
        "",
        "If something comes up, just reply to this and we'll move it.",
        "",
        "— Casey",
        "A.I. Advance Consultancy",
      ].join("\n");

  return send({
    to: email,
    subject: args.live
      ? "Dave's calling you in a few minutes"
      : `Fifteen minutes with Dave, ${args.spokenTime}`,
    text,
    replyTo: daveInbox(),
  });
}
