import Link from "next/link";
import { LibraryCards } from "@/components/LibraryCards";
import { StartJourney } from "@/components/StartJourney";
import { contactPath } from "@/lib/site";

const walkAway = [
  {
    title: "What we looked at",
    body: "The lane of work you named, including the messy exceptions.",
  },
  {
    title: "The findings, sorted",
    body: "Everything we heard, prioritised, with the reasoning shown.",
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
    body: "If no one can say how the work gets done start to finish, no tool can do it for you. Half of what we do is writing that down for the first time — and a lot of problems die right there, before any software.",
  },
  {
    title: "It won't replace your best person.",
    body: "What it does is give them back the forty minutes a day they spend retyping things they already have. That's the win. It's a bigger one than it sounds.",
  },
  {
    title: "It won't pay for itself because a website says so.",
    body: "If a tool can't point at an hour you'll stop spending, it's a subscription, not an investment. You'll find it on your statement in March and wonder what it was.",
  },
  {
    title: "And it won't wait for a perfect plan.",
    body: "One job, fixed properly, beats a twelve-month roadmap every time. Pick the thing that annoys you most on a Tuesday and start there.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <StartJourney />

      <section className="section section--tight" id="assessment">
        <div className="shell">
          <p className="kicker">The Assessment</p>
          <h2 className="display display--md">Want someone to just look at it for you?</h2>
          <p className="lede">
            One fixed fee, agreed before we start. Five business days. You keep
            everything either way — whether or not we ever work together again.
          </p>
        </div>
      </section>
      <ol className="steps-strip">
        <li className="step-panel">
          <span className="step-panel__n">01</span>
          <h3>A working call, not a sales call</h3>
          <p>
            Ninety minutes on how the work really gets done — who touches what,
            where it stalls, what gets typed twice. Most owners tell us nobody
            had ever asked.
          </p>
        </li>
        <li className="step-panel">
          <span className="step-panel__n">02</span>
          <h3>We take your week apart</h3>
          <p>
            Every repeating task goes in one of three piles: fix it now, look at
            it later, leave it alone. The third pile is usually the biggest, and
            we&apos;ll say so.
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
            Nothing to cancel and nothing to renew. You can hand the plan to
            anyone — us, someone else, or nobody.
          </p>
        </li>
      </ol>
      <div className="price-line">
        <div className="shell">
          <p>
            One fixed fee, agreed in writing before anything starts. Ask and
            you&apos;ll have a number the same day — there&apos;s no discovery
            funnel to go through first.
          </p>
          <div className="actions">
            <Link className="btn btn--solid" href="/assessment/">
              See how the assessment works →
            </Link>
            <Link className="text-link" href={contactPath()}>
              Or just ask me a question
            </Link>
          </div>
        </div>
      </div>

      <section className="section" id="deliverable">
        <div className="shell">
          <p className="kicker">What you walk away with</p>
          <h2 className="display display--md">
            Four documents, all of them plain English.
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
            you&apos;ll forget you&apos;re paying for. Four things are worth
            knowing before you spend anything.
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

      <section className="section" id="library">
        <div className="shell library-head">
          <div>
            <p className="kicker">The Library</p>
            <h2 className="display display--md">Free guides. Nobody paid to be in here.</h2>
          </div>
          <Link className="text-link" href="/library/">
            All 6 guides →
          </Link>
        </div>
        <LibraryCards limit={3} />
      </section>

      <section className="band--ink contact-lockup" id="contact">
        <div className="shell">
          <p className="kicker">Contact</p>
          <h2 className="display display--md">Write like a person. So will we.</h2>
          <p className="lede lede--tight">
            You&apos;re writing to one person, not a support queue. Whoever
            reads it is the same person who&apos;d do the work.
          </p>
          <div className="actions">
            <Link className="btn btn--invert" href={contactPath()}>
              Get in touch
            </Link>
            <Link className="btn btn--invert" href={contactPath({ topic: "assessment" })}>
              Ask about the assessment
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
