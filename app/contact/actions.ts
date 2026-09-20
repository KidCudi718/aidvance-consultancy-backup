"use server";

import { redirect } from "next/navigation";

const INBOX = "david.choukroun2@gmail.com";

export type ContactState = {
  error: string;
} | null;

function readField(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
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
    };
  }

  const subject =
    topic === "assessment"
      ? "The Assessment"
      : topic === "something-else"
        ? "Something else is eating my week"
        : "A question";

  const body = [message, "", `From: ${name}`, `Reply-to: ${email}`].join("\n");

  redirect(
    `mailto:${INBOX}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  );
}
