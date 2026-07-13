"use client";

import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Quiz" },
  { href: "/library", label: "Library" },
  { href: "/recommendations", label: "Anime" },
  { href: "/about", label: "About" },
];

export default function NavLinks() {
  const path = usePathname();
  return (
    <nav className="flex gap-1 text-sm">
      {links.map(({ href, label }) => {
        const active = path === href || (href !== "/" && path.startsWith(href));
        return (
          <a
            key={href}
            href={href}
            className={`relative px-3 py-1.5 rounded-lg transition-all duration-300 ${
              active
                ? "text-purple-700 bg-purple-100/80 font-semibold"
                : "text-gray-600 hover:text-purple-600 hover:bg-purple-50/50"
            }`}
          >
            {label}
            {active && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-purple-500 to-pink-400 rounded-full" />
            )}
          </a>
        );
      })}
    </nav>
  );
}
