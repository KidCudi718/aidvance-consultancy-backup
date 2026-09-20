import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ResourceRows } from "@/components/ResourceRows";
import { assessmentMailto, site } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <section className="hero" aria-label="Introduction">
        <div className="hero__mark">
          <Logo size="hero" priority />
        </div>
        <div className="hero__copy">
          <div>
            <p className="kicker">01 — Practice</p>
            <h1 className="display">Map the work. Then decide.</h1>
            <p className="lede">
              {site.name} is an independent practice for owners who need a
              decision, not a demo. The front door is an {site.offer.name}.
              Implementation is scoped later, and only if you ask.
            </p>
          </div>
          <div className="actions">
            <a className="btn btn--invert" href={assessmentMailto()}>
              Request an assessment
            </a>
            <Link className="btn btn--invert" href="/assessment">
              What you receive
            </Link>
          </div>
        </div>
      </section>

      <section className="offer-panel" id="offer">
        <div className="offer-panel__left">
          <p className="kicker">02 — The offer</p>
          <h2>{site.offer.name}</h2>
        </div>
        <div className="offer-panel__right">
          <p>
            One working session on a single lane of work, then a written brief
            you can hand to a partner who was not in the room. We rank what is
            worth changing, what to leave alone, and what not to buy.
          </p>
          <p>
            If the honest recommendation is “hire a person” or “clean the files
            first,” that is the deliverable. We will not invent a stack to
            justify the invoice.
          </p>
          <div className="actions">
            <a className="btn btn--solid" href={assessmentMailto()}>
              Book a conversation
            </a>
            <Link className="btn" href="/assessment">
              Full scope
            </Link>
          </div>
        </div>
      </section>

      <section className="band--ink method-band" id="method">
        <div className="shell">
          <p className="kicker">03 — How we work</p>
          <h2 className="display display--md">
            Four steps. Then we stop unless you ask us to continue.
          </h2>
        </div>
      </section>
      <ol className="steps-strip">
        <li className="step-panel">
          <span className="step-panel__n">01</span>
          <h3>You send a brief</h3>
          <p>What you sell, who does the work, which tools you pay for, one lane to inspect.</p>
        </li>
        <li className="step-panel">
          <span className="step-panel__n">02</span>
          <h3>Working session</h3>
          <p>Ninety minutes on triggers, handoffs, exceptions, and the last time it went badly.</p>
        </li>
        <li className="step-panel">
          <span className="step-panel__n">03</span>
          <h3>Written brief</h3>
          <p>A map, a ranking, a 90-day next step, and a do-not-automate list.</p>
        </li>
        <li className="step-panel">
          <span className="step-panel__n">04</span>
          <h3>Optional build</h3>
          <p>Implementation is a separate piece of work. No obligation to continue.</p>
        </li>
      </ol>

      <section className="section" id="deliverables">
        <div className="shell">
          <p className="kicker">04 — What you get</p>
          <h2 className="display display--md">
            A brief that can survive your bookkeeper.
          </h2>
        </div>
        <div className="cards">
          <div className="card">
            <strong>Current-state map</strong>
            <p>The lane as it is actually done, including the ugly exceptions.</p>
          </div>
          <div className="card">
            <strong>Opportunity ranking</strong>
            <p>Three to five moves. One of them may be “do nothing.”</p>
          </div>
          <div className="card">
            <strong>Cost of inaction</strong>
            <p>Hours, rework, and tools you already pay for, set beside a change.</p>
          </div>
          <div className="card">
            <strong>Do-not-automate list</strong>
            <p>Work that gets worse when you speed it up.</p>
          </div>
          <div className="card">
            <strong>Ninety-day next step</strong>
            <p>One sequence a busy owner can staff.</p>
          </div>
          <div className="card">
            <strong>What we did not inspect</strong>
            <p>Named limits. So the brief cannot pretend to be omniscient.</p>
          </div>
        </div>
      </section>

      <section id="fit">
        <div className="shell section--tight">
          <p className="kicker">05 — Fit</p>
          <h2 className="display display--md">
            Who this is for, and who should keep walking.
          </h2>
        </div>
        <div className="split-pair">
          <div className="split">
            <h3>For</h3>
            <ul>
              <li>Owners who feel late on AI and do not want to be sold a stack.</li>
              <li>Teams paying for seats that nobody opened last month.</li>
              <li>Operators who want a second opinion before a vendor demo.</li>
              <li>People who can name one messy lane of work, even roughly.</li>
            </ul>
          </div>
          <div className="split split--ink">
            <h3>Not for</h3>
            <ul>
              <li>Anyone hunting a free strategy call that becomes a retainer.</li>
              <li>Companies that want a model picked and “just built” with no map.</li>
              <li>Overnight transformation, whatever that was supposed to mean.</li>
              <li>Shops that will not write down what is off-limits.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section" id="resources">
        <div className="shell">
          <p className="kicker">06 — Resources</p>
          <h2 className="display display--md">
            Notes for people who still have a day job.
          </h2>
        </div>
        <ResourceRows />
      </section>

      <section className="band--ink contact-lockup" id="contact">
        <div className="shell">
          <p className="kicker">
            07 — Contact
          </p>
          <h2 className="display">Write before we talk.</h2>
          <a className="email" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <div className="actions">
            <a className="btn btn--invert" href={assessmentMailto()}>
              Request an assessment
            </a>
            <Link className="btn btn--invert" href="/contact">
              Contact notes
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
