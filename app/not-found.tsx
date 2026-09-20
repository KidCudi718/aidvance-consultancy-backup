import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="shell">
        <p className="kicker">404 — Missing page</p>
        <h1 className="display">This URL is not in the set.</h1>
        <p className="lede">
          The page is gone, or it never existed. The home page is still there.
        </p>
        <div className="actions">
          <Link className="btn btn--solid" href="/">
            Home
          </Link>
          <Link className="btn" href="/resources">
            Resources
          </Link>
        </div>
      </div>
    </section>
  );
}
