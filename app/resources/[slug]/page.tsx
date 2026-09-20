import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/ArticleBody";
import { ArticleJsonLd } from "@/components/JsonLd";
import { assessmentMailto } from "@/lib/site";
import { articles, getArticle } from "@/lib/articles";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams(): { slug: string }[] {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    return { title: "Not found" };
  }

  return {
    title: article.title,
    description: article.dek,
    alternates: { canonical: `/resources/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.dek,
      publishedTime: article.published,
      modifiedTime: article.updated,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      <ArticleJsonLd
        title={article.title}
        dek={article.dek}
        path={`/resources/${article.slug}`}
        published={article.published}
        updated={article.updated}
      />
      <article>
        <header className="article-hero">
          <div className="shell">
            <p className="kicker">
              <span className="kicker__num">Note</span>
              <span>
                {article.published} · {article.minutes} min
              </span>
            </p>
            <h1>{article.title}</h1>
            <p className="lede">{article.dek}</p>
          </div>
        </header>
        <div className="section section--tight" style={{ paddingTop: 0 }}>
          <div className="shell">
            <ArticleBody article={article} />
            <div className="actions" style={{ marginTop: "2.5rem" }}>
              <a className="btn btn--accent" href={assessmentMailto()}>
                Request the $999 assessment
              </a>
              <Link className="btn" href="/resources">
                All resources
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
