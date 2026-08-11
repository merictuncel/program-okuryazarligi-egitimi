import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "KVKK",
  description: "Kişisel verilerin korunması aydınlatma metni.",
  openGraph: {
    title: `KVKK | ${siteConfig.shortName}`,
    description: "Kişisel verilerin korunması aydınlatma metni.",
    url: `${siteConfig.url}/kvkk`,
    type: "website",
    locale: siteConfig.locale,
  },
};

export default async function KvkkPage() {
  const settings = await getSiteSettings();
  const content = settings?.kvkkText?.trim();

  return (
    <main id="main-content" className="container-page py-12 sm:py-16 lg:py-20">
      <header className="max-w-3xl">
        <p className="section-label">Yasal</p>
        <h1 className="section-title !text-4xl sm:!text-5xl">KVKK</h1>
        <div className="section-rule !w-28" />
        <p className="mt-5 text-muted">
          6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma
          metni.
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
            KVKK aydınlatma metni yakında bu sayfada yayımlanacaktır. Başvuru
            süreci açıldığında kişisel verilerin işlenmesine ilişkin bilgilendirme
            burada paylaşılacaktır.
          </p>
        </aside>
      )}
    </main>
  );
}
