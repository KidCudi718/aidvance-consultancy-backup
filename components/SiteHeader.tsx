"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Logo } from "@/components/Logo";
import { assessmentMailto, nav } from "@/lib/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  return (
    <header className="site-header">
      <div className="shell site-header__bar">
        <Link href="/" aria-label="Aidvance Consultancy home" onClick={() => setOpen(false)}>
          <Logo compact />
        </Link>
        <nav className="nav-desktop" aria-label="Primary">
          {nav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <a className="btn btn--accent" href={assessmentMailto()}>
            Request assessment
          </a>
        </nav>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open ? (
        <nav id={menuId} className="shell nav-mobile" aria-label="Primary mobile">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <a className="btn btn--accent" href={assessmentMailto()} onClick={() => setOpen(false)}>
            Request assessment
          </a>
        </nav>
      ) : null}
    </header>
  );
}
