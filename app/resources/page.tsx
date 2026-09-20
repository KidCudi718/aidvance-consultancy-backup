import type { Metadata } from "next";
import { ResourceRows } from "@/components/ResourceRows";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Short notes that help before you hire anyone: which tools to skip, how to map the work, and when not to speed it up.",
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
  return (
    <>
      <section className="article-hero">
        <div className="shell">
          <p className="kicker">Help before the ask</p>
          <h1>Read these before you hire anyone.</h1>
          <p className="lede">
            Why this helps: each note answers a worry owners have before they
            spend another Tuesday on a vendor call. No newsletter gate.
          </p>
        </div>
      </section>
      <ResourceRows />
    </>
  );
}
