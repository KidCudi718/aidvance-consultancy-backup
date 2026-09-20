import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "You're writing to one person, not a support queue. Whoever reads it is the same person who'd do the work.",
  alternates: { canonical: "/contact/" },
};

type PageProps = {
  searchParams: Promise<{
    message?: string | string[];
    topic?: string | string[];
  }>;
};

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
}

export default async function ContactPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const defaultMessage = first(params.message);
  const topic = first(params.topic);

  return (
    <section className="contact-split" aria-label="Contact">
      <div className="contact-split__ink">
        <div>
          <p className="kicker">Contact</p>
          <h1 className="display display--md">Write like a person. So will we.</h1>
          <p className="lede">
            You&apos;re writing to one person, not a support queue. Whoever
            reads it is the same person who&apos;d do the work.
          </p>
        </div>
        <p className="lede">A name, an email, and a short note is enough.</p>
      </div>
      <div className="contact-split__copy">
        <p className="kicker">Get in touch</p>
        <h2 className="display display--sm">You do not need a perfect brief.</h2>
        <p className="lede lede--form">
          What the business sells, the work that eats the week, and whether you
          want a look or just a straight answer. Missing pieces are fine.
        </p>
        <ContactForm
          key={`${topic}:${defaultMessage}`}
          defaultMessage={defaultMessage}
          topic={topic}
        />
        <p className="muted form-follow">
          If you would rather read first, start with{" "}
          <Link href="/library/">the library</Link>.
        </p>
      </div>
    </section>
  );
}
