import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ApplicationButton } from "@/components/ApplicationButton";
import { AnnouncementList } from "@/components/AnnouncementCard";
import {
  formatDateRange,
  getActiveAnnouncements,
  getSiteSettings,
} from "@/lib/data";
import { siteConfig } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings?.title ?? siteConfig.name;
  const description =
    settings?.purpose?.slice(0, 160) ?? siteConfig.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: siteConfig.url,
      type: "website",
      locale: siteConfig.locale,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export default async function HomePage() {
  const [settings, announcements] = await Promise.all([
    getSiteSettings(),
    getActiveAnnouncements(3),
  ]);

  const title = settings?.title ?? siteConfig.name;
  const dateRange = formatDateRange(settings?.startDate, settings?.endDate);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    name: title,
    description: settings?.purpose ?? siteConfig.description,
    provider: {
      "@type": "Organization",
      name: "Bolu Abant İzzet Baysal Üniversitesi",
      url: "https://www.ibu.edu.tr",
    },
    organizer: {
      "@type": "Organization",
      name: "TÜBİTAK",
      url: "https://tubitak.gov.tr/tr",
    },
    ...(settings?.location ? { location: settings.location } : {}),
    ...(dateRange ? { temporal: dateRange } : {}),
    url: siteConfig.url,
    inLanguage: "tr",
  };

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#061628_0%,#0a2540_48%,#14365c_100%)]" />
        <div className="absolute inset-0 opacity-[0.14] [background-image:radial-gradient(circle_at_20%_20%,rgba(197,206,216,0.35),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(26,74,122,0.45),transparent_40%)]" />

        <div className="container-page relative grid items-center gap-10 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14 lg:py-24">
          <div className="text-white">
            <p className="text-xs font-semibold tracking-[0.2em] text-silver uppercase">
              TÜBİTAK 2237-A
            </p>
            <h1 className="mt-4 max-w-3xl font-serif text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem]">
              {title}
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-silver/90 sm:text-base">
              Program okuryazarlığı eğitimi proje önerisi. Değerlendirme süreci
              devam etmektedir.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ApplicationButton
                applicationFormUrl={settings?.applicationFormUrl}
                variant="light"
              />
              <Link href="/hakkinda" className="btn btn-ghost">
                Proje Bilgileri
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="grid w-full max-w-md grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              <a
                href="https://tubitak.gov.tr/tr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TÜBİTAK resmi web sitesi"
                className="flex h-44 w-full items-center justify-center rounded-2xl bg-white px-5 shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition hover:opacity-95 sm:h-52 sm:px-6"
              >
                <Image
                  src="/tubitak-logo.png"
                  alt="TÜBİTAK"
                  width={280}
                  height={360}
                  className="h-auto max-h-32 w-auto max-w-[88%] object-contain sm:max-h-40"
                  priority
                  unoptimized
                />
              </a>
              <div className="flex h-44 w-full items-center justify-center rounded-2xl bg-white px-5 shadow-[0_12px_40px_rgba(0,0,0,0.25)] sm:h-52 sm:px-6">
                <Image
                  src="/projelogo.png"
                  alt="Program Okuryazarlığı Eğitimi"
                  width={646}
                  height={274}
                  className="h-auto max-h-24 w-auto max-w-[90%] object-contain sm:max-h-28"
                  priority
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {(dateRange || settings?.location) && (
        <section
          className="border-b border-navy/15 bg-gradient-to-r from-navy via-navy-mid to-accent"
          aria-label="Program özeti"
        >
          <div className="container-page flex flex-col gap-3 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-10 sm:gap-y-3 sm:py-5">
            {dateRange ? (
              <p className="flex min-w-0 items-baseline gap-2 text-sm text-white sm:text-[0.95rem]">
                <span className="shrink-0 text-[0.7rem] font-semibold tracking-[0.14em] text-silver uppercase">
                  Planlanan tarih
                </span>
                <span className="font-semibold tracking-tight">{dateRange}</span>
              </p>
            ) : null}
            {dateRange && settings?.location ? (
              <span
                className="hidden h-5 w-px bg-white/25 sm:block"
                aria-hidden
              />
            ) : null}
            {settings?.location ? (
              <p className="flex min-w-0 items-baseline gap-2 text-sm text-white sm:text-[0.95rem]">
                <span className="shrink-0 text-[0.7rem] font-semibold tracking-[0.14em] text-silver uppercase">
                  Yer
                </span>
                <span className="font-semibold tracking-tight">
                  {settings.location}
                </span>
              </p>
            ) : null}
          </div>
        </section>
      )}

      <section className="container-page py-14 sm:py-16 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <article className="card-static p-6 sm:p-8">
            <p className="section-label">Amaç</p>
            <h2 className="section-title !text-2xl sm:!text-3xl">
              Projenin Amacı
            </h2>
            <div className="section-rule" />
            <p className="prose-academic mt-5 whitespace-pre-wrap leading-relaxed text-muted">
              {settings?.purpose ??
                "Amaç metni yönetim panelinden güncellenecektir."}
            </p>
          </article>
          <article className="card-static p-6 sm:p-8">
            <p className="section-label">Kapsam</p>
            <h2 className="section-title !text-2xl sm:!text-3xl">
              Projenin Kapsamı
            </h2>
            <div className="section-rule" />
            <p className="prose-academic mt-5 whitespace-pre-wrap leading-relaxed text-muted">
              {settings?.scope ??
                "Kapsam metni yönetim panelinden güncellenecektir."}
            </p>
          </article>
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="container-page py-14 sm:py-16 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-label">Duyurular</p>
              <h2 className="section-title">Güncel Duyurular</h2>
              <div className="section-rule" />
            </div>
            <Link
              href="/duyurular"
              className="text-sm font-semibold text-accent hover:underline"
            >
              Tüm duyurular
            </Link>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <AnnouncementList announcements={announcements} />
          </div>
        </div>
      </section>

      <section className="container-page py-14 sm:py-16 lg:py-20">
        <div className="rounded-2xl bg-gradient-to-br from-navy-deep via-navy to-navy-mid px-6 py-10 text-white shadow-[0_12px_36px_rgba(10,37,64,0.18)] sm:px-10 sm:py-12">
          <h2 className="font-serif text-2xl font-bold tracking-tight sm:text-3xl">
            Planlanan program hakkında
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-silver sm:text-base">
            Eğitmen kadrosunu inceleyebilir; başvuru sürecinin, projenin
            desteklenmesi durumunda bu siteden duyurulacağını takip
            edebilirsiniz.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/egitmenler" className="btn btn-light">
              Eğitmen Kadrosu
            </Link>
            <Link href="/hakkinda" className="btn btn-ghost">
              Hakkında
            </Link>
            <ApplicationButton
              applicationFormUrl={settings?.applicationFormUrl}
              label="Başvuru Formu"
              variant="ghost"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
