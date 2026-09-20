import type { Metadata } from "next";
import Link from "next/link";
import { assessmentMailto, site, talkMailto } from "@/lib/site";

export const metadata: Metadata = {
  title: site.offer.name,
  description:
    "A short call, a look at how the work actually runs, and a written go / no-go plan. No tool upsell. No obligation to continue.",
  alternates: { canonical: "/assessment" },
};

const faqs = [
  {
    q: "Do I have to buy software after?",
    a: "No. The memo can say “keep what you have,” “drop this seat,” or “hire a person.” We are not paid to recommend a product.",
  },
  {
    q: "How long does this take?",
    a: "A short call, then a written plan you can read in one sitting. You do not need to clear a week.",
  },
  {
    q: "What do I need to prepare?",
    a: "What you sell, who does the work, tools you already pay for, and one messy lane. A recent late invoice or unused subscription is enough.",
  },
  {
    q: "What if the answer is “do nothing”?",
    a: "That is a valid result. You still keep the memo. We will not invent work to stay in the room.",
  },
  {
    q: "Who will I talk to?",
    a: `${site.person.name}, ${site.person.role}. ${site.person.line}`,
  },
  {
    q: "Is this a long retainer?",
    a: "No. The assessment stands on its own. Anything after that is a separate, optional piece of work.",
  },
] as const;

export default function AssessmentPage() {
  return (
    <>
      <section className="article-hero">
        <div className="shell">
          <p className="kicker">The offer</p>
          <h1>{site.offer.name}</h1>
          <p className="lede">
            {site.offer.duration}. You keep the plan even if you never hire us
            again.
          </p>
          <div className="actions">
            <a className="btn btn--solid" href={assessmentMailto()}>
              Request an assessment
            </a>
            <a className="btn" href={talkMailto()}>
              Talk to us
            </a>
          </div>
        </div>
      </section>

      <section className="band--ink method-band" id="process">
        <div className="shell">
          <p className="kicker">The process</p>
          <h2 className="display display--md">Same four steps as the home page. No surprises.</h2>
        </div>
      </section>
      <ol className="steps-strip">
        <li className="step-panel">
          <span className="step-panel__n">01</span>
          <h3>Short call</h3>
          <p>You tell us what you sell and what feels slow.</p>
        </li>
        <li className="step-panel">
          <span className="step-panel__n">02</span>
          <h3>We map the work</h3>
          <p>How the lane actually runs, including the exceptions.</p>
        </li>
        <li className="step-panel">
          <span className="step-panel__n">03</span>
          <h3>Go / no-go plan</h3>
          <p>A one-to-two page memo, not a forty-slide performance.</p>
        </li>
        <li className="step-panel">
          <span className="step-panel__n">04</span>
          <h3>You decide</h3>
          <p>No retainer to start. Implementation only if you ask.</p>
        </li>
      </ol>

      <section className="section" id="memo">
        <div className="shell">
          <p className="kicker">The deliverable</p>
          <h2 className="display display--md">
            What is on the page you take home.
          </h2>
        </div>
        <div className="memo">
          <div className="memo__rule">
            <span>Aidvance Consultancy</span>
            <span>Decision memo</span>
          </div>
          <ol className="memo__list">
            <li>
              <strong>What we looked at</strong>
              <span>The lane you named, plus the ugly exceptions.</span>
            </li>
            <li>
              <strong>Tools to keep, pause, or drop</strong>
              <span>Including software nobody opened last month.</span>
            </li>
            <li>
              <strong>Hours you can get back</strong>
              <span>Set beside a change a busy owner can staff.</span>
            </li>
            <li>
              <strong>Go / no-go on each idea</strong>
              <span>Yes, later, or no — with a reason.</span>
            </li>
            <li>
              <strong>What not to automate</strong>
              <span>Work that gets worse when you speed it up.</span>
            </li>
            <li>
              <strong>Next 90 days — optional</strong>
              <span>One sequence. You keep the memo either way.</span>
            </li>
          </ol>
        </div>
      </section>

      <section className="wont">
        <div className="shell">
          <p className="kicker">What we will not do</p>
          <ul className="wont__list">
            <li>No tool upsell.</li>
            <li>No long retainer to start.</li>
            <li>No jargon pitch.</li>
          </ul>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="shell">
          <p className="kicker">Questions owners actually ask</p>
          <h2 className="display display--md">Straight answers.</h2>
        </div>
        <dl className="faq">
          {faqs.map((item) => (
            <div className="faq__item" key={item.q}>
              <dt>{item.q}</dt>
              <dd>{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="band--ink contact-lockup">
        <div className="shell">
          <p className="kicker">Start</p>
          <h2 className="display display--md">A short note is enough.</h2>
          <p className="lede lede--tight">
            If you are still gathering notes, read the workflow audit first.
            Come back when the lane has a name.
          </p>
          <div className="actions">
            <a className="btn btn--invert" href={assessmentMailto()}>
              Request an assessment
            </a>
            <Link className="btn btn--invert" href="/resources/workflow-audit-before-tools">
              Read the audit note
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
