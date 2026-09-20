"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Logo } from "@/components/Logo";
import { nav } from "@/lib/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  return (
    <header className="site-header">
      <div className="shell site-header__bar">
        <Link href="/" aria-label="Aidvance Consultancy home" onClick={() => setOpen(false)}>
          <Logo size="nav" priority />
        </Link>
        <nav className="nav-desktop" aria-label="Primary">
          {nav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <Link className="btn btn--solid" href="/contact/">
            Get in touch
          </Link>
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
          <Link className="btn btn--solid" href="/contact/" onClick={() => setOpen(false)}>
            Get in touch
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
