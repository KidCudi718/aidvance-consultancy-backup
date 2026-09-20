import Link from "next/link";
import { articles } from "@/lib/articles";

export function ResourceRows({ limit }: { limit?: number }) {
  const list = limit ? articles.slice(0, limit) : articles;

  return (
    <div className="resource-index">
      {list.map((article) => (
        <Link
          key={article.slug}
          href={`/resources/${article.slug}`}
          className="resource-row"
        >
          <div className="resource-row__meta">
            <span>{article.published}</span>
            <span>{article.minutes} min read</span>
          </div>
          <h3 className="resource-row__title">{article.title}</h3>
          <p className="resource-row__dek">{article.dek}</p>
        </Link>
      ))}
    </div>
  );
}
