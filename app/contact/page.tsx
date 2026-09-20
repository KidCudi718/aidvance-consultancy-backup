import type { Metadata } from "next";
import Link from "next/link";
import { contactMailto, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `You're writing to one person, not a support queue. Write to ${site.email}.`,
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  return (
    <section className="contact-split" aria-label="Contact">
      <div className="contact-split__ink">
        <div>
          <p className="kicker">Contact</p>
          <h1 className="display display--md">Write like a person. So will we.</h1>
          <p className="lede">
            You&apos;re writing to one person, not a support queue. Whoever
            reads it is the same person who&apos;d do the work.
          </p>
        </div>
        <div>
          <a className="email" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <div className="actions">
            <a className="btn btn--invert" href={contactMailto()}>
              Ask a question
            </a>
            <a className="btn btn--invert" href={contactMailto("The Assessment")}>
              Ask about the assessment
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
            <li>The work that eats the week.</li>
            <li>Whether you want a look, or just a straight answer.</li>
          </ul>
          <p>
            Missing pieces are fine. If you would rather read first, start with{" "}
            <Link href="/library/">the library</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
