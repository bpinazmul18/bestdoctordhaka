"use client";

import { useState } from "react";
import { MenuIcon, XIcon } from "./icons";

export function MobileMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
        className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
      >
        {open ? <XIcon /> : <MenuIcon />}
      </button>
      <nav
        id="mobile-nav"
        aria-label="Primary"
        className={
          open
            ? "absolute inset-x-0 top-16 z-30 border-b border-slate-200 bg-white px-4 py-3 shadow-sm"
            : "hidden"
        }
      >
        {children}
      </nav>
    </div>
  );
}
