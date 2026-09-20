import Link from "next/link";
import { Logo } from "@/components/Logo";
import { nav, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__grid">
        <div>
          <Logo size="footer" />
          <p className="muted footer-blurb">
            No newsletter. No pop-ups. No pitch you didn&apos;t ask for.
          </p>
        </div>
        <div>
          <p className="kicker">On this site</p>
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
            <li>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
          </ul>
        </div>
        <div>
          <p className="kicker">Library</p>
          <ul>
            <li>
              <Link href="/library/">All six guides</Link>
            </li>
            <li>
              <Link href="/assessment/">The assessment</Link>
            </li>
            <li>
              <Link href="/contact/">Get in touch</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="shell fine">
        © {site.year} {site.name} · {site.city}
      </div>
    </footer>
  );
}
