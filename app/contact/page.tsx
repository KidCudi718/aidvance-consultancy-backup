import type { Metadata } from "next";
import Link from "next/link";
import { assessmentMailto, contactMailto, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Write to ${site.name} at ${site.email}. Assessment requests and ordinary enquiries.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section className="contact-split" aria-label="Contact">
      <div className="contact-split__ink">
        <div>
          <p className="kicker">Desk</p>
          <h1 className="display display--md">Write before we talk.</h1>
          <p className="lede">
            Mail is the intake. A form would pretend we have a queue we do not.
            Write in plain language. We will answer.
          </p>
        </div>
        <div>
          <a className="email" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <div className="actions">
            <a className="btn btn--invert" href={assessmentMailto()}>
              Request an assessment
            </a>
            <a className="btn btn--invert" href={contactMailto()}>
              General enquiry
            </a>
          </div>
        </div>
      </div>
      <div className="contact-split__copy">
        <p className="kicker">Useful to include</p>
        <h2 className="display display--sm">Name the lane. Leave the pitch.</h2>
        <div className="prose prose--flush">
          <ul>
            <li>What the business sells, and roughly at what volume.</li>
            <li>The one lane of work that feels expensive or slow.</li>
            <li>Tools you already pay for.</li>
            <li>What we should not look at.</li>
          </ul>
          <p>
            If you want help writing that, use{" "}
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
