import type { Metadata } from "next";
import { ResourceRows } from "@/components/ResourceRows";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Plain-English notes on AI assessments, wasted spend, workflow audits, briefing a consultant, and when not to automate.",
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
  return (
    <>
      <section className="article-hero">
        <div className="shell">
          <p className="kicker">Library</p>
          <h1>Resources</h1>
          <p className="lede">
            These notes are the public version of how we work. No newsletter gate.
            If a page cannot be used on a Tuesday, it does not belong here.
          </p>
        </div>
      </section>
      <ResourceRows />
    </>
  );
}
