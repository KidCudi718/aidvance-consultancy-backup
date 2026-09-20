import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleJsonLd } from "@/components/JsonLd";
import { GuideBody } from "@/components/GuideBody";
import { getGuide, guidePath, guides } from "@/lib/guides";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams(): { slug: string }[] {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);

  if (!guide) {
    return { title: "Not found" };
  }

  return {
    title: guide.title,
    description: guide.dek,
    alternates: { canonical: guidePath(guide.slug) },
    openGraph: {
      type: "article",
      title: guide.title,
      description: guide.dek,
      publishedTime: guide.published,
      modifiedTime: guide.updated,
    },
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuide(slug);

  if (!guide) {
    notFound();
  }

  return (
    <>
      <ArticleJsonLd
        title={guide.title}
        dek={guide.dek}
        path={guidePath(guide.slug)}
        published={guide.published}
        updated={guide.updated}
      />
      <GuideBody slug={guide.slug} />
      <div className="shell article-cta">
        <Link className="text-link" href="/library/">
          All 6 guides →
        </Link>
      </div>
    </>
  );
}
