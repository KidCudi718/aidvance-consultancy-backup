import type { Metadata } from "next";
import Link from "next/link";
import { contactPath, site } from "@/lib/site";

export const metadata: Metadata = {
  title: site.offer.name,
  description:
    "One fixed fee, agreed before we start. Five business days. You keep everything either way, whether or not we ever work together again.",
  alternates: { canonical: "/assessment/" },
};

/**
 * Everything that sells lives here and nowhere else.
 *
 * The homepage is a diagnostic; this page is the offer. Anything that answers
 * "should I buy this" belongs on this side of the line, including the parts
 * that talk people out of it.
 */
const walkAway = [
  {
    title: "What we looked at",
    body: "The lane of work you named, including the messy exceptions.",
  },
  {
    title: "The findings, sorted",
    body: "Everything we heard, prioritized, with the reasoning shown.",
  },
  {
    title: "A ranked roadmap",
    body: "What to do first, second, third, and who needs to be involved.",
  },
  {
    title: "Written procedures",
    body: "How the job is done today. Often the first time it has existed on paper.",
  },
  {
    title: "What you can do yourself, and what needs a builder",
    body: "An honest split, so you don't pay for help you don't need.",
  },
  {
    title: "What to leave alone",
    body: "The work that gets worse when you speed it up. Usually the longest list.",
  },
] as const;

const fit = [
  "You run the business, or you can decide without a committee.",
  "Something in your week is clearly repetitive and getting worse.",
  "You'd rather be told what not to do than be sold a platform.",
  "Between one and roughly fifty people.",
] as const;

const notFit = [
  "You want somebody to build software. We'll introduce you to people who do.",
  "You're looking for a headcount reduction plan. That isn't this.",
  "You need a decision this afternoon. The work takes five business days.",
  "You want us to say AI will transform everything. It won't, and we won't.",
] as const;

const principles = [
  {
    title: "It won't fix a job nobody can explain.",
    body: "If nobody can say how the work gets done start to finish, no tool can do it for you. Half of what we do is writing that down for the first time, and a lot of problems die right there.",
  },
  {
    title: "It won't replace your best person.",
    body: "It gives them back the forty minutes a day they spend retyping things they already have. That is the win, and it is bigger than it sounds.",
  },
  {
    title: "It won't pay for itself because a website says so.",
    body: "If a tool can't point at an hour you will stop spending, it is a subscription, not an investment.",
  },
  {
    title: "And it won't wait for a perfect plan.",
    body: "One job, fixed properly, beats a twelve-month roadmap. Pick the thing that annoys you most on a Tuesday.",
  },
] as const;

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

      <section className="section" id="deliverable">
        <div className="shell">
          <p className="kicker">What you walk away with</p>
          <h2 className="display display--md">
            Six documents, all of them plain English.
          </h2>
        </div>
        <div className="memo memo--static" aria-label="What you walk away with">
          <div className="memo__rule">
            <span>Aidvance Consultancy</span>
            <span>The file you keep</span>
          </div>
          <ol className="memo__list">
            {walkAway.map((item) => (
              <li key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.body}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="shell">
          <p className="closing-note">
            Every figure in the report is a figure you gave us. We don&apos;t
            model savings you didn&apos;t describe.
          </p>
        </div>
      </section>

      <section id="fit">
        <div className="split-pair">
          <div className="split">
            <h3>When this is worth your money</h3>
            <ul>
              {fit.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
          <div className="split split--ink">
            <h3>When we&apos;ll tell you to keep it</h3>
            <ul>
              {notFit.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section section--tight" id="principles">
        <div className="shell">
          <p className="kicker">Before you spend anything</p>
          <h2 className="display display--md">We&apos;ll talk you out of things.</h2>
          <p className="lede">
            Most of what gets sold to small businesses as AI is a subscription
            you&apos;ll forget you&apos;re paying for. Four things to know first.
          </p>
        </div>
      </section>
      <ol className="steps-strip">
        {principles.map((item, index) => (
          <li className="step-panel" key={item.title}>
            <span className="step-panel__n">{String(index + 1).padStart(2, "0")}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </li>
        ))}
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
