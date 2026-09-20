import type { Metadata } from "next";
import { LibraryCards } from "@/components/LibraryCards";

export const metadata: Metadata = {
  title: "Library",
  description: "Free guides. Nobody paid to be in here.",
  alternates: { canonical: "/library/" },
};

export default function LibraryPage() {
  return (
    <>
      <section className="article-hero">
        <div className="shell">
          <p className="kicker">The Library</p>
          <h1>Free guides. Nobody paid to be in here.</h1>
          <p className="lede">
            Six notes for owner-operators. Use them on a Tuesday. No gate, no
            newsletter, nothing sponsored.
          </p>
        </div>
      </section>
      <LibraryCards />
    </>
  );
}
