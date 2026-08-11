import type { Metadata } from "next";
import { FaqAccordion } from "@/components/FaqAccordion";
import { getActiveFaqItems } from "@/lib/data";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular",
  description: "Proje ve başvuru süreci hakkında sıkça sorulan sorular.",
  openGraph: {
    title: `SSS | ${siteConfig.shortName}`,
    description: "Proje ve başvuru süreci hakkında sıkça sorulan sorular.",
    url: `${siteConfig.url}/sss`,
    type: "website",
    locale: siteConfig.locale,
  },
};

export default async function FaqPage() {
  const items = await getActiveFaqItems();

  return (
    <main id="main-content" className="container-page py-12 sm:py-16 lg:py-20">
      <header className="max-w-3xl">
        <p className="section-label">Yardım</p>
        <h1 className="section-title !text-4xl sm:!text-5xl">
          Sıkça Sorulan Sorular
        </h1>
        <div className="section-rule !w-28" />
        <p className="mt-5 text-muted">
          Proje, başvuru ve etkinlik süreci hakkında merak edilenler.
        </p>
      </header>

      {items.length > 0 ? (
        <FaqAccordion
          items={items.map((item) => ({
            id: item.id,
            question: item.question,
            answer: item.answer,
          }))}
        />
      ) : (
        <aside className="mt-10 max-w-3xl rounded-2xl border border-navy/10 bg-silver-soft/80 px-5 py-4 sm:px-6 sm:py-5">
          <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
            Bilgilendirme
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink sm:text-[0.95rem]">
            Sıkça sorulan sorular yakında bu sayfada yer alacaktır. Başvuru
            süreci açıldığında sık sorulan konular burada yanıtlanacaktır.
          </p>
        </aside>
      )}
    </main>
  );
}
