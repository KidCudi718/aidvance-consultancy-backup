"use server";

export type ContactState = {
  error: string | null;
  success: boolean;
} | null;

// Server-only fallback. Never import this file from a client component,
// page copy, JSON-LD, footer, or a redirect URL.
const FALLBACK_INBOX = "david.choukroun2@gmail.com";

function readField(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function contactInbox(): string {
  const fromEnv = process.env.CONTACT_INBOX?.trim();
  return fromEnv || FALLBACK_INBOX;
}

function subjectForTopic(topic: string): string {
  if (topic === "assessment") {
    return "The Assessment";
  }
  if (topic === "something-else") {
    return "Something else is eating my week";
  }
  return "A question";
}

function isFormSubmitSuccess(payload: unknown): boolean {
  if (!payload || typeof payload !== "object" || !("success" in payload)) {
    return false;
  }
  const success = payload.success;
  return success === true || success === "true";
}

async function deliverWithResend(args: {
  inbox: string;
  name: string;
  email: string;
  subject: string;
  text: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return false;
  }

  const from =
    process.env.CONTACT_FROM?.trim() ||
    "Aidvance Consultancy <onboarding@resend.dev>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [args.inbox],
      reply_to: args.email,
      subject: args.subject,
      text: args.text,
    }),
  });

  if (!response.ok) {
    console.error("Contact delivery failed via Resend", response.status);
    return false;
  }

  return true;
}

async function deliverWithFormSubmit(args: {
  inbox: string;
  name: string;
  email: string;
  message: string;
  subject: string;
}): Promise<boolean> {
  const response = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(args.inbox)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: args.name,
        email: args.email,
        message: args.message,
        _subject: args.subject,
      }),
    },
  );

  if (!response.ok) {
    console.error("Contact delivery failed via FormSubmit", response.status);
    return false;
  }

  const payload: unknown = await response.json();
  if (!isFormSubmitSuccess(payload)) {
    console.error("Contact delivery rejected by FormSubmit");
    return false;
  }

  return true;
}

export async function submitContact(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = readField(formData, "name");
  const email = readField(formData, "email");
  const message = readField(formData, "message");
  const topic = readField(formData, "topic");

  if (name.length < 2 || !email.includes("@") || message.length < 2) {
    return {
      error: "Please add your name, a real email, and a short note.",
      success: false,
    };
  }

  const inbox = contactInbox();
  const subject = subjectForTopic(topic);
  const text = [message, "", `From: ${name}`, `Reply-to: ${email}`].join("\n");

  try {
    const sent = process.env.RESEND_API_KEY
      ? await deliverWithResend({
          inbox,
          name,
          email,
          subject,
          text,
        })
      : await deliverWithFormSubmit({
          inbox,
          name,
          email,
          message,
          subject,
        });

    if (!sent) {
      return {
        error: "Couldn't send that just now. Try again in a minute.",
        success: false,
      };
    }
  } catch (error) {
    console.error(
      "Contact delivery threw",
      error instanceof Error ? error.message : "unknown error",
    );
    return {
      error: "Couldn't send that just now. Try again in a minute.",
      success: false,
    };
  }

  return { error: null, success: true };
}
