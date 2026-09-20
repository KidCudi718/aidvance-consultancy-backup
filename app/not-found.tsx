import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="shell">
        <p className="kicker">
          <span className="kicker__num">404</span>
          <span>Missing page</span>
        </p>
        <h1 className="display">This URL is not in the set.</h1>
        <p className="lede">
          The page is gone, or it never existed. The practice is still at the
          root.
        </p>
        <div className="actions">
          <Link className="btn btn--accent" href="/">
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
