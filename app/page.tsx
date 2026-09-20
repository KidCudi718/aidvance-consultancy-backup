import Link from "next/link";
import { LibraryCards } from "@/components/LibraryCards";
import { StartJourney } from "@/components/StartJourney";
import { contactPath } from "@/lib/site";

/**
 * The homepage is a conversation, not a brochure.
 *
 * A provocation, the person who can answer it, nine things that are true about
 * their week, somewhere to read, and a way to write. Nothing on this page sells
 * anything: the offer lives on /assessment/ for whoever goes looking, and Casey
 * handles it for everyone else.
 */
export default function HomePage() {
  return (
    <>
      <StartJourney />

      <section className="section" id="library">
        <div className="shell library-head">
          <div>
            <p className="kicker">The Library</p>
            <h2 className="display display--md">Free guides. Nobody paid to be in here.</h2>
          </div>
          <Link className="text-link" href="/library/">
            All six guides →
          </Link>
        </div>
        <LibraryCards limit={3} />
      </section>

      <section className="band--ink contact-lockup" id="contact">
        <div className="shell">
          <p className="kicker">Contact</p>
          <h2 className="display display--md">Write like a person. So will we.</h2>
          <p className="lede lede--tight">
            You&apos;re writing to one person, not a support queue.
          </p>
          <div className="actions">
            <Link className="btn btn--invert" href={contactPath()}>
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
