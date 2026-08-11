"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const links = [
  { href: "/admin", label: "Özet", exact: true },
  { href: "/admin/settings", label: "Site Ayarları" },
  { href: "/admin/basvuru", label: "Başvuru" },
  { href: "/admin/program", label: "Program" },
  { href: "/admin/instructors", label: "Eğitmenler" },
  { href: "/admin/announcements", label: "Duyurular" },
  { href: "/admin/faq", label: "SSS" },
  { href: "/admin/documents", label: "Belgeler" },
  { href: "/admin/gallery", label: "Galeri" },
];

export function AdminSidebar({ email }: { email?: string | null }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col border-b border-slate-200 bg-slate-900 text-white md:min-h-screen md:w-64 md:border-b-0 md:border-r md:border-slate-800">
      <div className="px-5 py-5">
        <p className="text-xs tracking-[0.2em] text-white/50 uppercase">Yönetim</p>
        <h1 className="mt-1 font-serif text-xl">TÜBİTAK 2237</h1>
        <p className="mt-2 truncate text-xs text-white/60">{email}</p>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-4 md:flex-col md:overflow-visible">
        {links.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? "bg-white text-slate-900"
                  : "text-white/80 hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex gap-2 border-t border-white/10 p-4">
        <Link
          href="/"
          className="flex-1 rounded-lg border border-white/20 px-3 py-2 text-center text-xs hover:bg-white/10"
        >
          Siteye Dön
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex-1 rounded-lg bg-white/10 px-3 py-2 text-xs hover:bg-white/20"
        >
          Çıkış
        </button>
      </div>
    </aside>
  );
}
