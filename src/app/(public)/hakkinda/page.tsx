import type { Metadata } from "next";
import { formatDateRange, getSiteSettings } from "@/lib/data";
import { siteConfig } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = "Hakkında";
  const description =
    settings?.purpose?.slice(0, 160) ??
    "Düzenleme kurulu, bilim kurulu ve program detayları.";

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${siteConfig.shortName}`,
      description,
      url: `${siteConfig.url}/hakkinda`,
      type: "website",
      locale: siteConfig.locale,
    },
  };
}

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const dateRange = formatDateRange(settings?.startDate, settings?.endDate);

  return (
    <main id="main-content" className="container-page py-12 sm:py-16 lg:py-20">
      <header className="max-w-3xl">
        <p className="section-label">Program Bilgisi</p>
        <h1 className="section-title !text-4xl sm:!text-5xl">Hakkında</h1>
        <div className="section-rule !w-28" />
        <p className="mt-5 text-muted">
          {settings?.title ?? siteConfig.name}
          {dateRange ? ` · Planlanan tarih: ${dateRange}` : ""}
          {settings?.location ? ` · ${settings.location}` : ""}
        </p>
        <p className="mt-3 text-sm text-silver-muted">
          Bu etkinlik öneri aşamasındadır; TÜBİTAK değerlendirme süreci devam
          etmektedir.
        </p>
      </header>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
        <section>
          <article className="card-static p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-navy">Projenin Detaylı İçeriği</h2>
            <div className="mt-6 space-y-7 leading-relaxed text-muted">
              <div>
                <h3 className="mb-2 text-xs font-semibold tracking-[0.14em] text-navy uppercase">
                  Amaç
                </h3>
                <p className="whitespace-pre-wrap">
                  {settings?.purpose ?? "Amaç metni henüz eklenmedi."}
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-xs font-semibold tracking-[0.14em] text-navy uppercase">
                  Kapsam
                </h3>
                <p className="whitespace-pre-wrap">
                  {settings?.scope ?? "Kapsam metni henüz eklenmedi."}
                </p>
              </div>
            </div>
          </article>
        </section>

        <aside className="space-y-6">
          <article className="card p-6">
            <h2 className="text-xl font-bold text-navy">Düzenleme Kurulu</h2>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-muted">
              {settings?.organizingCommittee ??
                "Düzenleme kurulu bilgileri yakında eklenecektir."}
            </p>
          </article>
          <article className="card p-6">
            <h2 className="text-xl font-bold text-navy">Bilim Kurulu</h2>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-muted">
              {settings?.scientificCommittee ??
                "Bilim kurulu üyeleri kesinleştikten sonra bu alanda duyurulacaktır."}
            </p>
          </article>
        </aside>
      </div>
    </main>
  );
}
