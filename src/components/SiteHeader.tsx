"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ApplicationButton } from "@/components/ApplicationButton";

const links = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hakkinda", label: "Hakkında" },
  { href: "/program", label: "Program" },
  { href: "/egitmenler", label: "Eğitmenler" },
  { href: "/duyurular", label: "Duyurular" },
  { href: "/galeri", label: "Galeri" },
  { href: "/basvuru-kosullari", label: "Başvuru" },
  { href: "/iletisim", label: "İletişim" },
];

export function SiteHeader({
  applicationFormUrl,
}: {
  applicationFormUrl?: string | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line/90 bg-surface/95 shadow-[0_1px_0_rgba(10,37,64,0.04)] backdrop-blur-md">
      <div className="container-page flex items-center justify-between gap-3 py-2.5 sm:py-3">
        <div className="flex min-w-0 shrink items-center gap-2.5 sm:gap-3">
          <a
            href="https://tubitak.gov.tr/tr"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            aria-label="TÜBİTAK resmi web sitesi"
          >
            <Image
              src="/tubitak-logo.png"
              alt="TÜBİTAK"
              width={120}
              height={150}
              className="h-14 w-auto object-contain sm:h-16"
              priority
              unoptimized
            />
          </a>
          <span className="hidden h-10 w-px bg-line sm:block" aria-hidden />
          <Link href="/" className="min-w-0" aria-label="Ana sayfa">
            <Image
              src="/projelogo.png"
              alt="Program Okuryazarlığı Eğitimi"
              width={646}
              height={274}
              className="h-9 w-auto max-w-[min(42vw,220px)] object-contain sm:h-11 sm:max-w-[260px]"
              priority
              unoptimized
            />
          </Link>
        </div>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Ana menü">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-3.5 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
                  active
                    ? "bg-navy text-white shadow-sm"
                    : "text-ink hover:bg-silver-soft"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <ApplicationButton
            applicationFormUrl={applicationFormUrl}
            variant="nav"
            className="ml-2"
          />
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <a
            href="https://www.ibu.edu.tr/Website/Default.aspx"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-1 transition hover:bg-silver-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            aria-label="Bolu Abant İzzet Baysal Üniversitesi"
          >
            <Image
              src="/baibulogo.png"
              alt="Bolu Abant İzzet Baysal Üniversitesi"
              width={160}
              height={160}
              className="h-10 w-auto object-contain sm:h-11"
              unoptimized
            />
          </a>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-white text-navy shadow-sm transition hover:bg-silver-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
          >
            <span className="sr-only">Menü</span>
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 block h-0.5 w-5 rounded-full bg-navy transition ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute top-1.5 left-0 block h-0.5 w-5 rounded-full bg-navy transition ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-5 rounded-full bg-navy transition ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`border-t border-line bg-surface lg:hidden ${
          open ? "block" : "hidden"
        }`}
      >
        <nav
          className="container-page flex flex-col gap-1 py-3"
          aria-label="Mobil menü"
        >
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-navy text-white"
                    : "text-ink hover:bg-silver-soft"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <ApplicationButton
            applicationFormUrl={applicationFormUrl}
            variant="primary"
            className="mt-2 w-full"
          />
        </nav>
      </div>
    </header>
  );
}
