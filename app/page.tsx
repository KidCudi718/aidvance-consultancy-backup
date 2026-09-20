import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ResourceRows } from "@/components/ResourceRows";
import { assessmentMailto, site, talkMailto } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <section className="hero" aria-label="Introduction">
        <div className="hero__mark">
          <Logo size="hero" priority />
        </div>
        <div className="hero__copy">
          <div>
            <p className="kicker">For small-business owners</p>
            <h1 className="display">Know which AI tools to skip.</h1>
            <p className="lede">
              Get hours back each week. Stop paying for software you do not use.
              We look at how the work actually runs, then write a clear go /
              no-go plan. You decide. No pressure.
            </p>
          </div>
          <div className="actions">
            <a className="btn btn--invert" href={assessmentMailto()}>
              Request an assessment
            </a>
            <a className="btn btn--invert" href={talkMailto()}>
              Talk to us
            </a>
          </div>
        </div>
      </section>

      <section className="band--ink method-band" id="method">
        <div className="shell">
          <p className="kicker">How it works</p>
          <h2 className="display display--md">Four steps. Then you decide.</h2>
        </div>
      </section>
      <ol className="steps-strip">
        <li className="step-panel">
          <span className="step-panel__n">01</span>
          <h3>Short call</h3>
          <p>You tell us what you sell and what feels slow. No pitch.</p>
        </li>
        <li className="step-panel">
          <span className="step-panel__n">02</span>
          <h3>We map the work</h3>
          <p>How it actually runs on a busy Thursday — not the tidy version.</p>
        </li>
        <li className="step-panel">
          <span className="step-panel__n">03</span>
          <h3>Go / no-go plan</h3>
          <p>A short written memo: what to try, what to skip, what to leave.</p>
        </li>
        <li className="step-panel">
          <span className="step-panel__n">04</span>
          <h3>You decide</h3>
          <p>No retainer to start. No obligation to continue.</p>
        </li>
      </ol>

      <section className="section" id="deliverable">
        <div className="shell">
          <p className="kicker">What you walk away with</p>
          <h2 className="display display--md">
            A one-to-two page decision memo. Not a slide deck.
          </h2>
        </div>
        <div className="memo" aria-label="Decision memo outline">
          <div className="memo__rule">
            <span>Aidvance Consultancy</span>
            <span>Decision memo</span>
          </div>
          <ol className="memo__list">
            <li>
              <strong>What we looked at</strong>
              <span>The one lane of work you named, including the messy exceptions.</span>
            </li>
            <li>
              <strong>Tools to keep, pause, or drop</strong>
              <span>Software you already pay for — especially seats nobody opened.</span>
            </li>
            <li>
              <strong>Hours you can get back</strong>
              <span>Where the week actually goes, set beside a change you can staff.</span>
            </li>
            <li>
              <strong>Go / no-go on each idea</strong>
              <span>A clear yes, later, or no — with a reason a partner can read.</span>
            </li>
            <li>
              <strong>What not to automate</strong>
              <span>Work that gets worse when you speed it up.</span>
            </li>
            <li>
              <strong>Next 90 days — only if you want it</strong>
              <span>One sequence. Optional. You keep the memo either way.</span>
            </li>
          </ol>
        </div>
      </section>

      <section id="fit">
        <div className="shell section--tight">
          <p className="kicker">Fit</p>
          <h2 className="display display--md">
            Built for owners. Honest about who should walk on.
          </h2>
        </div>
        <div className="split-pair">
          <div className="split">
            <h3>This is for you if</h3>
            <ul>
              <li>You run a small or mid-size shop and feel late on AI.</li>
              <li>You are paying for tools that do not shorten the week.</li>
              <li>You want a second opinion before another vendor demo.</li>
              <li>You can name one messy lane of work, even roughly.</li>
            </ul>
          </div>
          <div className="split split--ink">
            <h3>Who it is not for</h3>
            <ul>
              <li>Anyone hunting a free strategy call that becomes a retainer.</li>
              <li>Shops that want software picked and “just built” with no map.</li>
              <li>Overnight overhaul. That is not how a Tuesday changes.</li>
              <li>Teams that will not write down what is off-limits.</li>
            </ul>
          </div>
        </div>
        <div className="wont">
          <div className="shell">
            <p className="kicker">What we will not do</p>
            <ul className="wont__list">
              <li>No tool upsell. We do not get paid to recommend a product.</li>
              <li>No long retainer to start. The assessment stands on its own.</li>
              <li>No jargon pitch. If it cannot name a Tuesday job, it is out.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section" id="resources">
        <div className="shell">
          <p className="kicker">Help before the ask</p>
          <h2 className="display display--md">
            Read these before you hire anyone.
          </h2>
          <p className="lede">
            Short notes for the usual worries. Use them on a Tuesday. No gate.
          </p>
        </div>
        <ResourceRows />
      </section>

      <section className="person-band" id="who">
        <div className="shell person">
          <div className="person__mark" aria-hidden="true">
            {site.person.name
              .split(" ")
              .map((part) => part.slice(0, 1))
              .join("")}
          </div>
          <div>
            <p className="kicker">Who you talk to</p>
            <h2 className="display display--sm">{site.person.name}</h2>
            <p className="person__role">{site.person.role}</p>
            <p className="lede">{site.person.line}</p>
          </div>
        </div>
      </section>

      <section className="band--ink contact-lockup" id="contact">
        <div className="shell">
          <p className="kicker">Next step</p>
          <h2 className="display">A short note is enough.</h2>
          <p className="lede lede--tight">
            Tell us what you sell and what feels slow. We will answer. No form.
          </p>
          <a className="email" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <div className="actions">
            <a className="btn btn--invert" href={assessmentMailto()}>
              Request an assessment
            </a>
            <Link className="btn btn--invert" href="/contact">
              Talk to us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
