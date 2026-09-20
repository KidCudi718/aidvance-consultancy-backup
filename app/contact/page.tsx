import type { Metadata } from "next";
import Link from "next/link";
import { assessmentMailto, site, talkMailto } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Write to ${site.person.name} at ${site.email}. A short note is enough.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section className="contact-split" aria-label="Contact">
      <div className="contact-split__ink">
        <div>
          <p className="kicker">Talk to us</p>
          <h1 className="display display--md">A short note is enough.</h1>
          <p className="lede">
            No form. No queue theatre. Write in plain language. {site.person.name}{" "}
            will answer.
          </p>
        </div>
        <div>
          <p className="person__role person__role--on-ink">{site.person.role}</p>
          <p className="person__name">{site.person.name}</p>
          <a className="email" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <div className="actions">
            <a className="btn btn--invert" href={assessmentMailto()}>
              Request an assessment
            </a>
            <a className="btn btn--invert" href={talkMailto()}>
              Talk to us
            </a>
          </div>
        </div>
      </div>
      <div className="contact-split__copy">
        <p className="kicker">If it helps</p>
        <h2 className="display display--sm">You do not need a perfect brief.</h2>
        <div className="prose prose--flush">
          <ul>
            <li>What the business sells.</li>
            <li>The work that feels slow or expensive.</li>
            <li>Tools you already pay for.</li>
            <li>What we should not look at.</li>
          </ul>
          <p>
            Missing pieces are fine. If you want a template, use{" "}
            <Link href="/resources/how-to-brief-a-consultant">
              the briefing note
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
