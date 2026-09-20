import type { Metadata } from "next";
import Link from "next/link";
import { contactPath, site } from "@/lib/site";

export const metadata: Metadata = {
  title: site.offer.name,
  description:
    "One fixed fee, agreed before we start. Five business days. You keep everything either way, whether or not we ever work together again.",
  alternates: { canonical: "/assessment/" },
};

export default function AssessmentPage() {
  return (
    <>
      <section className="article-hero">
        <div className="shell">
          <p className="kicker">The Assessment</p>
          <h1>Want someone to just look at it for you?</h1>
          <p className="lede">
            One fixed fee, agreed before we start. Five business days. You keep
            everything either way.
          </p>
        </div>
      </section>

      <ol className="steps-strip">
        <li className="step-panel">
          <span className="step-panel__n">01</span>
          <h3>A working call, not a sales call</h3>
          <p>
            Ninety minutes on how the work really gets done. Who touches what,
            where it stalls, what gets typed twice. Most owners tell us nobody
            had ever asked.
          </p>
        </li>
        <li className="step-panel">
          <span className="step-panel__n">02</span>
          <h3>We take your week apart</h3>
          <p>
            Every repeating task goes in one of three piles: fix it now, look
            at it later, leave it alone. The third pile is usually the biggest,
            and we&apos;ll say so.
          </p>
        </li>
        <li className="step-panel">
          <span className="step-panel__n">03</span>
          <h3>You get it in writing, in plain English</h3>
          <p>
            What we found, what to do about it, and in what order. No jargon, no
            vendor logos. Every number in it is a number you gave us.
          </p>
        </li>
        <li className="step-panel">
          <span className="step-panel__n">04</span>
          <h3>Then it&apos;s yours</h3>
          <p>
            Nothing to cancel, nothing to renew. Hand the plan to us, to
            someone else, or to nobody.
          </p>
        </li>
      </ol>

      <div className="price-line">
        <div className="shell">
          <p>
            Ask and you&apos;ll have a number the same day. Nothing starts
            until the fee is agreed in writing.
          </p>
          <div className="actions">
            <Link className="btn btn--solid" href={contactPath({ topic: "assessment" })}>
              Ask for a number
            </Link>
            <Link className="text-link" href={contactPath()}>
              Or just ask me a question
            </Link>
          </div>
        </div>
      </div>

      <section className="band--ink contact-lockup">
        <div className="shell">
          <p className="kicker">Next</p>
          <h2 className="display display--md">A short note is enough.</h2>
          <p className="lede lede--tight">
            You&apos;re writing to one person, not a support queue. Whoever
            reads it is the same person who&apos;d do the work.
          </p>
          <div className="actions">
            <Link className="btn btn--invert" href="/contact/">
              Get in touch
            </Link>
            <Link className="btn btn--invert" href="/library/">
              Or read a guide first
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
