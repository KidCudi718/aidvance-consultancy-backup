import Link from "next/link";
import { Logo } from "@/components/Logo";
import { articles } from "@/lib/articles";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__grid">
        <div>
          <Logo compact />
          <p className="muted" style={{ marginTop: "1.1rem", maxWidth: "22rem" }}>
            Independent AI consultancy. A written decision before anyone sells you a stack.
          </p>
        </div>
        <div>
          <p className="kicker" style={{ marginBottom: "0.75rem" }}>
            <span>Practice</span>
          </p>
          <ul>
            <li>
              <Link href="/#offer">AI Opportunity Assessment</Link>
            </li>
            <li>
              <Link href="/assessment">What the fee covers</Link>
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
          <p className="kicker" style={{ marginBottom: "0.75rem" }}>
            <span>Resources</span>
          </p>
          <ul>
            {articles.map((article) => (
              <li key={article.slug}>
                <Link href={`/resources/${article.slug}`}>{article.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="shell fine">
        © {new Date().getFullYear()} {site.name}. Intended home: {site.domain}. DNS is configured
        by the owner, not by this repository.
      </div>
    </footer>
  );
}
