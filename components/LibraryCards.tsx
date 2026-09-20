import Link from "next/link";
import { guidePath, homepageGuides, type Guide, guides } from "@/lib/guides";

export function LibraryCards({
  limit,
}: {
  limit?: number;
}) {
  const list: Guide[] = limit ? homepageGuides() : guides;

  return (
    <div className={`library-cards${list.length === 3 ? " library-cards--three" : ""}`}>
      {list.map((guide) => (
        <Link key={guide.slug} href={guidePath(guide.slug)} className="library-card">
          <span className="library-card__eyebrow">{guide.eyebrow}</span>
          <h3>{guide.title}</h3>
          <p>{guide.meta}</p>
        </Link>
      ))}
    </div>
  );
}
