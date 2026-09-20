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
    <section className="article-hero">
      <div className="shell grid-12">
        <div className="col-6">
          <p className="kicker">
            <span className="kicker__num">Desk</span>
            <span>No form, on purpose</span>
          </p>
          <h1>Contact</h1>
          <p className="lede">
            Mail is the intake. A form would pretend we have a queue we do not.
            Write in plain language. We will answer.
          </p>
        </div>
        <div className="col-6 contact-panel">
          <div>
            <p className="kicker">
              <span>Direct</span>
            </p>
            <a className="email" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </div>
          <div className="actions">
            <a className="btn btn--accent" href={assessmentMailto()}>
              Assessment request
            </a>
            <a className="btn" href={contactMailto()}>
              General enquiry
            </a>
          </div>
          <div className="prose">
            <h2>Useful to include</h2>
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
      </div>
    </section>
  );
}
