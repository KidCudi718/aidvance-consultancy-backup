"use client";

import { useActionState } from "react";
import { submitContact } from "@/app/contact/actions";

export function ContactForm({
  defaultMessage = "",
  topic = "",
}: {
  defaultMessage?: string;
  topic?: string;
}) {
  const [state, action, pending] = useActionState(submitContact, null);

  return (
    <form id="form" className="contact-form" action={action}>
      {topic ? <input type="hidden" name="topic" value={topic} /> : null}
      <label className="contact-form__field">
        <span>Name</span>
        <input name="name" type="text" autoComplete="name" required minLength={2} />
      </label>
      <label className="contact-form__field">
        <span>Email</span>
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label className="contact-form__field">
        <span>Message</span>
        <textarea
          name="message"
          rows={8}
          required
          minLength={2}
          defaultValue={defaultMessage}
        />
      </label>
      {state?.error ? <p className="contact-form__error">{state.error}</p> : null}
      <button className="btn btn--solid" type="submit" disabled={pending}>
        {pending ? "Opening…" : "Send the note"}
      </button>
    </form>
  );
}
