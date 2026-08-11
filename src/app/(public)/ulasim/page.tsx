import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ulaşım ve Konaklama",
  description: "Etkinlik yeri ulaşım ve konaklama bilgileri.",
  openGraph: {
    title: `Ulaşım ve Konaklama | ${siteConfig.shortName}`,
    description: "Etkinlik yeri ulaşım ve konaklama bilgileri.",
    url: `${siteConfig.url}/ulasim`,
    type: "website",
    locale: siteConfig.locale,
  },
};

export default async function TravelPage() {
  const settings = await getSiteSettings();
  const content = settings?.travelInfo?.trim();

  return (
    <main id="main-content" className="container-page py-12 sm:py-16 lg:py-20">
      <header className="max-w-3xl">
        <p className="section-label">Lojistik</p>
        <h1 className="section-title !text-4xl sm:!text-5xl">
          Ulaşım ve Konaklama
        </h1>
        <div className="section-rule !w-28" />
        <p className="mt-5 text-muted">
          Etkinlik yerine ulaşım ve konaklama seçenekleri hakkında bilgi.
        </p>
      </header>

      {content ? (
        <article className="card-static mt-10 max-w-3xl p-6 sm:p-8">
          <p className="whitespace-pre-wrap leading-relaxed text-muted">
            {content}
          </p>
        </article>
      ) : (
        <aside className="mt-10 max-w-3xl rounded-2xl border border-navy/10 bg-silver-soft/80 px-5 py-4 sm:px-6 sm:py-5">
          <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
            Bilgilendirme
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink sm:text-[0.95rem]">
            Ulaşım ve konaklama bilgileri yakında bu sayfada yayımlanacaktır.
            Etkinlik tarihi ve yeri kesinleştiğinde yol tarifleri ve konaklama
            önerileri burada paylaşılacaktır.
          </p>
        </aside>
      )}
    </main>
  );
}
