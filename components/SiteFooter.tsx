import Link from "next/link";
import { Logo } from "@/components/Logo";
import { articles } from "@/lib/articles";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__grid">
        <div>
          <Logo size="footer" />
          <p className="muted footer-blurb">
            For owners who need to know which AI tools to skip — and how to get
            hours back each week.
          </p>
          <p className="muted">
            {site.person.name}, {site.person.role}
          </p>
        </div>
        <div>
          <p className="kicker">Practice</p>
          <ul>
            <li>
              <Link href="/assessment">{site.offer.name}</Link>
            </li>
            <li>
              <Link href="/#method">How it works</Link>
            </li>
            <li>
              <Link href="/contact">Talk to us</Link>
            </li>
            <li>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
          </ul>
        </div>
        <div>
          <p className="kicker">Resources</p>
          <ul>
            {articles.map((article) => (
              <li key={article.slug}>
                <Link href={`/resources/${article.slug}`}>{article.shortTitle}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="shell fine">
        © {new Date().getFullYear()} {site.name}
      </div>
    </footer>
  );
}
