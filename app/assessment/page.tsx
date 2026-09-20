import type { Metadata } from "next";
import Link from "next/link";
import { assessmentMailto, site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${site.offer.name} (${site.offer.feeLabel})`,
  description:
    "Fixed-fee AI Opportunity Assessment: one working session and a written brief. Implementation scoped separately, with no obligation.",
  alternates: { canonical: "/assessment" },
};

export default function AssessmentPage() {
  return (
    <>
      <section className="article-hero">
        <div className="shell">
          <p className="kicker">
            <span className="kicker__num">Offer</span>
            <span>Fixed fee · {site.offer.feeLabel}</span>
          </p>
          <h1>{site.offer.name}</h1>
          <p className="lede">
            {site.offer.duration}. A decision you can keep even if you never hire
            us again.
          </p>
          <div className="actions">
            <a className="btn btn--accent" href={assessmentMailto()}>
              Request the assessment
            </a>
            <Link className="btn" href="/resources/assessment-versus-hype">
              Assessment versus hype
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--rule section--tight">
        <div className="shell grid-12">
          <div className="col-5">
            <h2 className="display" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)" }}>
              What the {site.offer.feeLabel} pays for
            </h2>
          </div>
          <div className="col-7 prose">
            <p>
              The fee covers preparation from your brief, a working session of
              about ninety minutes, and a written assessment delivered as a
              short document — not a 40-slide performance.
            </p>
            <ul>
              <li>Review of the lane of work you name, including exceptions.</li>
              <li>Inventory of tools you already pay for, used or not.</li>
              <li>Ranked opportunities with a reason each one is in or out.</li>
              <li>A do-not-automate list.</li>
              <li>One 90-day next step sized for a busy owner.</li>
            </ul>
            <p>
              It does not cover implementation, software licenses, or ongoing
              access to us. Those, if they happen, are scoped after you have the
              brief in hand.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--rule section--tight">
        <div className="shell grid-12">
          <div className="col-5">
            <h2 className="display" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)" }}>
              How to start
            </h2>
          </div>
          <div className="col-7 prose">
            <p>
              Send the email. Include what you sell, who does the work, and the
              lane you want inspected. If you have a recent mess — a late
              invoice run, a quote that took a week, a tool nobody uses — name
              it. We will reply with times and what access, if any, is useful.
            </p>
            <p>
              If you are still gathering notes, read{" "}
              <Link href="/resources/workflow-audit-before-tools">
                the workflow audit
              </Link>{" "}
              and{" "}
              <Link href="/resources/how-to-brief-a-consultant">
                how to brief a consultant
              </Link>
              . Come back when the lane has a name.
            </p>
            <div className="actions">
              <a className="btn btn--accent" href={assessmentMailto()}>
                Email {site.email}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
