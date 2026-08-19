"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Quiz" },
  { href: "/library", label: "Library" },
  { href: "/recommendations", label: "Anime" },
  { href: "/about", label: "About" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const isActive = (href: string) => path === href || (href !== "/" && path.startsWith(href));
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent tracking-tight">
          <img src="/logo.png" alt="" className="w-8 h-8" />
          Anime Match
        </a>
        <nav className="hidden md:flex gap-1 text-sm items-center">
          {links.map(l => {
            const active = isActive(l.href);
            return (
              <a key={l.href} href={l.href} className={`relative px-3 py-1.5 rounded-lg transition-all ${active ? "text-purple-700 bg-purple-100/80 font-semibold" : "text-gray-600 hover:text-purple-600 hover:bg-purple-50/50"} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400`}>
                {l.label}
                {active && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-purple-500 to-pink-400 rounded-full" />}
              </a>
            );
          })}
          <a href="https://www.effectivecpmnetwork.com/yuy7hxfcs?key=f38b2e62893ef70d40541caadb150281" target="_blank" rel="noopener sponsored" className="ml-1 inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold hover:scale-[1.03] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400">🔥 Deals</a>
        </nav>
        <button aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(v => !v)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400">
          <span className="block w-5 h-0.5 bg-current rounded transition-all" style={{ transform: open ? "translateY(6px) rotate(45deg)" : "none" }} />
          <span className="block w-5 h-0.5 bg-current rounded my-1 transition-opacity" style={{ opacity: open ? 0 : 1 }} />
          <span className="block w-5 h-0.5 bg-current rounded transition-all" style={{ transform: open ? "translateY(-6px) rotate(-45deg)" : "none" }} />
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur px-4 py-3 animate-fade-in-up">
          <nav className="flex flex-col gap-1">
            {links.map(l => {
              const active = isActive(l.href);
              return (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className={`px-3 py-2.5 rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${active ? "bg-purple-100 text-purple-700" : "hover:bg-purple-50 text-gray-700 hover:text-purple-700"}`}>
                  {l.label}
                </a>
              );
            })}
            <a href="https://www.effectivecpmnetwork.com/yuy7hxfcs?key=f38b2e62893ef70d40541caadb150281" target="_blank" rel="noopener sponsored" className="mt-1 text-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold">🔥 Trending Anime Deals</a>
          </nav>
        </div>
      )}
    </header>
  );
}
