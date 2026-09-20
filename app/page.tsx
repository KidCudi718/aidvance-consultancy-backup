import Link from "next/link";
import { ResourceRows } from "@/components/ResourceRows";
import { assessmentMailto, site } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="shell">
          <p className="kicker">
            <span className="kicker__num">01</span>
            <span>Practice</span>
          </p>
          <h1 className="display">
            Most AI spend fails for a boring reason: nobody mapped the work first.
          </h1>
          <p className="lede">
            {site.name} is an independent practice for owners who need a decision,
            not a demo. The front door is a fixed-fee {site.offer.name}.
            Implementation is scoped later, and only if you ask.
          </p>
          <div className="actions">
            <a className="btn btn--accent" href={assessmentMailto()}>
              Request the {site.offer.feeLabel} assessment
            </a>
            <Link className="btn" href="/assessment">
              What you receive
            </Link>
          </div>
          <dl className="hero__meta">
            <div className="meta-item">
              <dt>Fee</dt>
              <dd>Fixed {site.offer.feeLabel}. No retainer to start.</dd>
            </div>
            <div className="meta-item">
              <dt>Bias</dt>
              <dd>Tool-agnostic. We do not resell software.</dd>
            </div>
            <div className="meta-item">
              <dt>Obligation</dt>
              <dd>The brief stands alone. Build work is optional.</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="section section--ink" id="offer">
        <div className="shell grid-12">
          <div className="col-5">
            <p className="kicker">
              <span className="kicker__num">02</span>
              <span>The offer</span>
            </p>
            <p className="price">{site.offer.feeLabel}</p>
            <h2 className="display" style={{ fontSize: "clamp(2rem, 4.6vw, 3.2rem)", marginTop: "1rem" }}>
              {site.offer.name}
            </h2>
          </div>
          <div className="col-7">
            <hr className="rule-accent" />
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
              <a className="btn btn--invert" href={assessmentMailto()}>
                Email to book
              </a>
              <Link className="btn btn--invert" href="/assessment">
                Full scope
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--rule" id="method">
        <div className="shell grid-12">
          <div className="col-5">
            <p className="kicker">
              <span className="kicker__num">03</span>
              <span>How we work</span>
            </p>
            <h2 className="display" style={{ fontSize: "clamp(2rem, 4.6vw, 3.2rem)" }}>
              Four steps. Then we stop unless you ask us to continue.
            </h2>
          </div>
          <div className="col-7">
            <ol className="steps">
              <li className="step">
                <span className="step__n">01</span>
                <div>
                  <h3>You send a brief</h3>
                  <p>
                    What you sell, who does the work, which tools you already pay
                    for, and one lane to inspect. A page is enough. See{" "}
                    <Link href="/resources/how-to-brief-a-consultant">
                      how to brief a consultant
                    </Link>
                    .
                  </p>
                </div>
              </li>
              <li className="step">
                <span className="step__n">02</span>
                <div>
                  <h3>Working session</h3>
                  <p>
                    Ninety minutes on the actual workflow: triggers, handoffs,
                    exceptions, and the last time it went badly. We do not need
                    company-wide access to ask dull questions.
                  </p>
                </div>
              </li>
              <li className="step">
                <span className="step__n">03</span>
                <div>
                  <h3>Written assessment</h3>
                  <p>
                    A short record: current-state map, ranked opportunities,
                    cost of the mess versus cost of a tool, a 90-day next step,
                    and a “do not automate” list.
                  </p>
                </div>
              </li>
              <li className="step">
                <span className="step__n">04</span>
                <div>
                  <h3>Optional implementation</h3>
                  <p>
                    If you want help after the brief, we scope that as a
                    separate piece of work. No obligation. The assessment is
                    complete whether or not you continue.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section className="section section--rule" id="deliverables">
        <div className="shell grid-12">
          <div className="col-5">
            <p className="kicker">
              <span className="kicker__num">04</span>
              <span>What you get</span>
            </p>
            <h2 className="display" style={{ fontSize: "clamp(2rem, 4.6vw, 3.2rem)" }}>
              A brief that can survive your bookkeeper.
            </h2>
          </div>
          <div className="col-7">
            <div className="deliverables">
              <div className="deliverable">
                <strong>Current-state map</strong>
                <p>
                  The lane as it is actually done, including the ugly exceptions.
                  Not a swimlane from a template.
                </p>
              </div>
              <div className="deliverable">
                <strong>Opportunity ranking</strong>
                <p>
                  Three to five moves scored by effort, risk, and payback. One of
                  them may be “do nothing.”
                </p>
              </div>
              <div className="deliverable">
                <strong>Cost of inaction</strong>
                <p>
                  Hours, rework, and tools you already pay for, set beside the
                  cost of a change. No vanity ROI.
                </p>
              </div>
              <div className="deliverable">
                <strong>Do-not-automate list</strong>
                <p>
                  Work that gets worse when you speed it up: rare tasks, judgment
                  you sell, processes you do not yet understand.
                </p>
              </div>
              <div className="deliverable">
                <strong>Ninety-day next step</strong>
                <p>
                  One sequence a busy owner can staff. If that sequence is “hire,
                  don’t buy,” it will say so.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--rule" id="fit">
        <div className="shell">
          <p className="kicker">
            <span className="kicker__num">05</span>
            <span>Fit</span>
          </p>
          <h2 className="display" style={{ fontSize: "clamp(2rem, 4.6vw, 3.2rem)" }}>
            Who this is for, and who should keep walking.
          </h2>
          <div className="split-pair" style={{ marginTop: "2rem" }}>
            <div className="split">
              <h3>For</h3>
              <ul>
                <li>Owners who feel late on AI and do not want to be sold a stack.</li>
                <li>Teams paying for seats that nobody opened last month.</li>
                <li>Operators who want a second opinion before a vendor demo.</li>
                <li>People who can name one messy lane of work, even roughly.</li>
              </ul>
            </div>
            <div className="split">
              <h3>Not for</h3>
              <ul>
                <li>Anyone hunting a free strategy call that becomes a retainer.</li>
                <li>Companies that want a model picked and “just built” with no map.</li>
                <li>Overnight transformation, whatever that was supposed to mean.</li>
                <li>Shops that will not write down what is off-limits.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--rule" id="resources">
        <div className="shell">
          <p className="kicker">
            <span className="kicker__num">06</span>
            <span>Resources</span>
          </p>
          <h2 className="display" style={{ fontSize: "clamp(2rem, 4.6vw, 3.2rem)" }}>
            Plain-English notes for people who still have a day job.
          </h2>
          <p className="lede">
            Written for owners first. Peers are welcome to disagree in public.
          </p>
          <ResourceRows />
          <div className="actions">
            <Link className="btn" href="/resources">
              Resource index
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--rule" id="contact">
        <div className="shell grid-12">
          <div className="col-5">
            <p className="kicker">
              <span className="kicker__num">07</span>
              <span>Contact</span>
            </p>
            <h2 className="display" style={{ fontSize: "clamp(2rem, 4.6vw, 3.2rem)" }}>
              Write before we talk.
            </h2>
          </div>
          <div className="col-7">
            <p>
              Email{" "}
              <a href={`mailto:${site.email}`}>
                {site.email}
              </a>
              . Say what the business does, which lane of work is messy, and
              what you already pay for. If you want the assessment, say so in
              the subject line.
            </p>
            <div className="actions">
              <a className="btn btn--accent" href={assessmentMailto()}>
                Start an assessment email
              </a>
              <Link className="btn" href="/contact">
                Contact notes
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
