import type { Metadata } from "next";
import { getActiveDocuments } from "@/lib/data";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Belgeler",
  description: "İndirilebilir proje belgeleri ve formlar.",
  openGraph: {
    title: `Belgeler | ${siteConfig.shortName}`,
    description: "İndirilebilir proje belgeleri ve formlar.",
    url: `${siteConfig.url}/belgeler`,
    type: "website",
    locale: siteConfig.locale,
  },
};

export default async function DocumentsPage() {
  const documents = await getActiveDocuments();

  return (
    <main id="main-content" className="container-page py-12 sm:py-16 lg:py-20">
      <header className="max-w-3xl">
        <p className="section-label">Kaynaklar</p>
        <h1 className="section-title !text-4xl sm:!text-5xl">Belgeler</h1>
        <div className="section-rule !w-28" />
        <p className="mt-5 text-muted">
          Proje ile ilgili indirilebilir belgeler ve formlar.
        </p>
      </header>

      {documents.length > 0 ? (
        <ul className="mt-10 max-w-3xl space-y-4">
          {documents.map((doc) => (
            <li key={doc.id}>
              <article className="card-static flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="min-w-0">
                  <h2 className="font-semibold text-navy">{doc.title}</h2>
                  {doc.description ? (
                    <p className="mt-1 text-sm text-muted">{doc.description}</p>
                  ) : null}
                  {doc.fileName ? (
                    <p className="mt-1 text-xs text-silver-muted">{doc.fileName}</p>
                  ) : null}
                </div>
                <a
                  href={doc.fileUrl}
                  download={doc.fileName ?? true}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center justify-center rounded-xl bg-navy px-4 py-2.5 text-sm font-medium text-white transition hover:bg-navy-mid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  İndir
                </a>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <aside className="mt-10 max-w-3xl rounded-2xl border border-navy/10 bg-silver-soft/80 px-5 py-4 sm:px-6 sm:py-5">
          <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
            Bilgilendirme
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink sm:text-[0.95rem]">
            İndirilebilir belgeler yakında bu sayfada paylaşılacaktır. Başvuru
            ve bilgilendirme formları kesinleştiğinde buradan erişilebilecektir.
          </p>
        </aside>
      )}
    </main>
  );
}
