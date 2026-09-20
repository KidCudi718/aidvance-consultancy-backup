/**
 * Everything a human reads after Casey finishes a conversation.
 *
 * Emails are sent by us rather than by Google. That is not a workaround for
 * its own sake: a service account cannot send Google's invitations without
 * domain-wide delegation, and sending them ourselves means the visitor gets
 * mail from aidvance.xyz instead of a personal Gmail address. Better outcome
 * for the reason we would have wanted anyway.
 *
 * Every message goes out as HTML with a plain-text twin. The text twin is not
 * a formality: it is what a watch, a screen reader and a stripped-down client
 * actually render, so it has to read as a finished message on its own.
 */

const RESEND_URL = "https://api.resend.com/emails";

/**
 * Brand constants for mail.
 *
 * The logo is served from the site's own public folder, so it survives every
 * deploy and needs no third-party host. Intrinsic size is 1181x396; it is
 * declared at 180x60 so it stays crisp on a retina screen. Both dimensions are
 * set explicitly because Outlook reserves no space for an image without them.
 */
const LOGO_URL = "https://aidvance.xyz/brand/logo.png";
const LOGO_WIDTH = 180;
const LOGO_HEIGHT = 60;
const SITE_URL = "https://aidvance.xyz";
const INK = "#111111";
const MUTED = "#6b6b6b";
const RULE = "#e4e4e4";

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

/** Anything that reaches the HTML came from a stranger's mouth. Escape it. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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

  const detail = detailPairs(brief).map(([label, value]) => `${label}: ${value}`);
  const reach = reachPairs(brief).map(([label, value]) => `${label}: ${value}`);

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

/** The interview answers, in the order Dave wants to hear them. */
function detailPairs(brief: Briefing): Array<[string, string]> {
  return (
    [
      ["Size", brief.headcount],
      ["How long going", brief.yearsGoing],
      ["Biggest time sink", brief.pain],
      ["Hours a week on it", brief.hours],
      ["Who does it", brief.whoDoesIt],
      ["Getting worse?", brief.trajectory],
      ["What it costs them", brief.consequence],
      ["Already tried", brief.tried],
      ["Who decides", brief.authority],
      ["Timing", brief.timing],
    ] as Array<[string, string | undefined]>
  )
    .map(([label, value]) => [label, value?.trim() ?? ""] as [string, string])
    .filter(([, value]) => value.length > 0);
}

function reachPairs(brief: Briefing): Array<[string, string]> {
  return (
    [
      ["Phone", brief.phone],
      ["Email", brief.email],
    ] as Array<[string, string | undefined]>
  )
    .map(([label, value]) => [label, value?.trim() ?? ""] as [string, string])
    .filter(([, value]) => value.length > 0);
}

/**
 * The frame every email sits in.
 *
 * Table-based and inline-styled on purpose: Outlook still ignores most of a
 * stylesheet, and a message that arrives unstyled is worse than one that was
 * never designed. Black and white only, which is the brand and also the only
 * palette that survives dark mode without going muddy.
 */
function shell(args: { preheader: string; body: string }): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
    <title>A.I. Advance Consultancy</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f6f6f6;">
    <div style="display:none;font-size:1px;color:#f6f6f6;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${esc(
      args.preheader,
    )}</div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f6f6f6;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="width:560px;max-width:100%;background-color:#ffffff;border:1px solid ${RULE};">
            <tr>
              <td style="padding:32px 32px 24px 32px;border-bottom:1px solid ${RULE};">
                <a href="${SITE_URL}" style="text-decoration:none;">
                  <img src="${LOGO_URL}" width="${LOGO_WIDTH}" height="${LOGO_HEIGHT}" alt="A.I. Advance Consultancy" style="display:block;border:0;outline:none;width:${LOGO_WIDTH}px;height:${LOGO_HEIGHT}px;" />
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;line-height:24px;color:${INK};">
${args.body}
              </td>
            </tr>
          </table>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="width:560px;max-width:100%;">
            <tr>
              <td style="padding:16px 32px 0 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;line-height:18px;color:${MUTED};">
                A.I. Advance Consultancy · <a href="${SITE_URL}" style="color:${MUTED};text-decoration:underline;">aidvance.xyz</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** A sign-off block that reads like a person's Gmail signature, not a footer. */
function signature(args: { name: string; title: string }): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;border-top:1px solid ${RULE};width:100%;">
  <tr>
    <td style="padding-top:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;line-height:20px;color:${INK};">
      <div style="font-weight:600;">${esc(args.name)}</div>
      <div style="color:${MUTED};">${esc(args.title)}</div>
      <div style="color:${MUTED};">A.I. Advance Consultancy</div>
      <div style="margin-top:6px;"><a href="${SITE_URL}" style="color:${INK};text-decoration:underline;">aidvance.xyz</a></div>
    </td>
  </tr>
</table>`;
}

function paragraph(text: string): string {
  return `<p style="margin:0 0 16px 0;">${esc(text)}</p>`;
}

/** The briefing as a two-column table, because Dave scans it, he doesn't read it. */
function briefingHtml(brief: Briefing): string {
  const rows = [...detailPairs(brief), ...reachPairs(brief)];
  if (rows.length === 0) {
    return "";
  }
  const cells = rows
    .map(
      ([label, value]) => `    <tr>
      <td style="padding:8px 16px 8px 0;vertical-align:top;white-space:nowrap;font-size:13px;color:${MUTED};border-bottom:1px solid ${RULE};">${esc(
        label,
      )}</td>
      <td style="padding:8px 0;vertical-align:top;font-size:14px;color:${INK};border-bottom:1px solid ${RULE};">${esc(
        value,
      )}</td>
    </tr>`,
    )
    .join("\n");

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;margin:8px 0 8px 0;border-collapse:collapse;">
${cells}
</table>`;
}

async function send(args: {
  to: string;
  subject: string;
  text: string;
  html: string;
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
        html: args.html,
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
  let banner: string;

  switch (args.kind) {
    case "live":
      subject = `CALL NOW — ${who}${phoneSuffix}`;
      opening =
        "Casey just told them you'd call in the next few minutes. They are waiting.";
      banner = "Call now";
      break;
    case "booked":
      subject = `Booked ${args.spokenTime ?? ""} — ${who}`.replace("  ", " ");
      opening = `Casey booked this for ${args.spokenTime ?? "a time on your calendar"}.`;
      banner = `Booked — ${args.spokenTime ?? "on your calendar"}`;
      break;
    case "email":
      subject = `Lead — took the guide, no call yet — ${who}`;
      opening =
        "No meeting. She handed over the guide and got their email, and they wanted to read it first. Worth a call in a few days — this is the one you would never have heard about.";
      banner = "Took the guide";
      break;
    default:
      subject = `Lead — talked, didn't book — ${who}`;
      opening =
        "No meeting and no email. They talked, then left. Everything she got is below, in case it is worth chasing.";
      banner = "Talked, didn't book";
      break;
  }

  const text = [
    opening,
    "",
    briefingText(args.brief),
    args.eventLink ? `\nOn your calendar: ${args.eventLink}` : "",
  ].join("\n");

  const whoLine = [
    args.brief.business?.trim() ? `They run ${args.brief.business.trim()}.` : null,
    args.brief.location?.trim() ? `Based in ${args.brief.location.trim()}.` : null,
  ]
    .filter(Boolean)
    .join(" ");

  const html = shell({
    preheader: opening,
    body: [
      `<div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:${MUTED};margin:0 0 8px 0;">${esc(
        banner,
      )}</div>`,
      `<h1 style="margin:0 0 4px 0;font-size:22px;line-height:28px;font-weight:600;color:${INK};">${esc(
        args.brief.name.trim(),
      )}</h1>`,
      whoLine
        ? `<p style="margin:0 0 20px 0;color:${MUTED};">${esc(whoLine)}</p>`
        : `<div style="height:12px;"></div>`,
      paragraph(opening),
      briefingHtml(args.brief),
      args.brief.notes?.trim()
        ? `<p style="margin:16px 0 0 0;padding-left:16px;border-left:2px solid ${RULE};color:${INK};">${esc(
            args.brief.notes.trim(),
          )}</p>`
        : "",
      args.eventLink
        ? `<p style="margin:24px 0 0 0;"><a href="${esc(
            args.eventLink,
          )}" style="display:inline-block;padding:11px 20px;background-color:${INK};color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">Open on your calendar</a></p>`
        : "",
    ]
      .filter(Boolean)
      .join("\n"),
  });

  return send({
    to: daveInbox(),
    subject,
    text,
    html,
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

  const paragraphs = args.live
    ? [
        `Hi ${first},`,
        "Dave's going to call you in the next few minutes — this is just so you have it in writing, and so you know the number that rings isn't spam.",
        "Fifteen minutes, no obligation, and he'll tell you straight if the answer isn't worth paying for.",
        "If he doesn't reach you, reply to this and we'll find another time.",
      ]
    : [
        `Hi ${first},`,
        `You're down for fifteen minutes with Dave ${args.spokenTime}.`,
        "He'll call you. No prep needed — he'll ask how the work actually gets done and tell you straight where AI helps and where it honestly doesn't.",
        "If something comes up, just reply to this and we'll move it.",
      ];

  const text = [
    ...paragraphs,
    ["— Casey", "A.I. Advance Consultancy", SITE_URL].join("\n"),
  ].join("\n\n");

  const html = shell({
    preheader: args.live
      ? "Dave's calling you in a few minutes."
      : `Fifteen minutes with Dave, ${args.spokenTime}.`,
    body: [
      ...paragraphs.map(paragraph),
      signature({ name: "Casey", title: "Client Services" }),
    ].join("\n"),
  });

  return send({
    to: email,
    subject: args.live
      ? "Dave's calling you in a few minutes"
      : `Fifteen minutes with Dave, ${args.spokenTime}`,
    text,
    html,
    replyTo: daveInbox(),
  });
}
