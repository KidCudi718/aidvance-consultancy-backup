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
            Independent AI consultancy. A written decision before anyone sells you a stack.
          </p>
        </div>
        <div>
          <p className="kicker">Practice</p>
          <ul>
            <li>
              <Link href="/#offer">AI Opportunity Assessment</Link>
            </li>
            <li>
              <Link href="/assessment">What you receive</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
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
