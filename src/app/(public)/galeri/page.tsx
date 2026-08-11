import type { Metadata } from "next";
import Image from "next/image";
import { getActiveGalleryImages, getSiteSettings } from "@/lib/data";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Galeri",
  description: "Etkinlik görselleri ve sertifika bilgilendirmesi.",
  openGraph: {
    title: `Galeri | ${siteConfig.shortName}`,
    description: "Etkinlik görselleri ve sertifika bilgilendirmesi.",
    url: `${siteConfig.url}/galeri`,
    type: "website",
    locale: siteConfig.locale,
  },
};

export default async function GalleryPage() {
  const [images, settings] = await Promise.all([
    getActiveGalleryImages(),
    getSiteSettings(),
  ]);
  const certificateInfo = settings?.certificateInfo?.trim();

  return (
    <main id="main-content" className="container-page py-12 sm:py-16 lg:py-20">
      <header className="max-w-3xl">
        <p className="section-label">Görseller</p>
        <h1 className="section-title !text-4xl sm:!text-5xl">Galeri</h1>
        <div className="section-rule !w-28" />
        <p className="mt-5 text-muted">
          Etkinlikten kareler ve bilgilendirici görseller.
        </p>
      </header>

      {certificateInfo ? (
        <aside className="mt-8 max-w-3xl rounded-2xl border border-navy/10 bg-silver-soft/80 px-5 py-4 sm:px-6 sm:py-5">
          <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
            Sertifika
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink sm:text-[0.95rem]">
            {certificateInfo}
          </p>
        </aside>
      ) : null}

      {images.length > 0 ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((item) => (
            <figure
              key={item.id}
              className="card-static overflow-hidden transition hover:-translate-y-0.5"
            >
              <div className="relative aspect-[4/3] w-full bg-silver-soft">
                <Image
                  src={item.imageUrl}
                  alt={item.title ?? "Galeri görseli"}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  unoptimized
                />
              </div>
              {(item.title || item.caption) && (
                <figcaption className="space-y-1 p-4">
                  {item.title ? (
                    <p className="font-medium text-navy">{item.title}</p>
                  ) : null}
                  {item.caption ? (
                    <p className="text-sm text-muted">{item.caption}</p>
                  ) : null}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      ) : (
        <aside className="mt-10 max-w-3xl rounded-2xl border border-navy/10 bg-silver-soft/80 px-5 py-4 sm:px-6 sm:py-5">
          <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
            Bilgilendirme
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink sm:text-[0.95rem]">
            Galeri görselleri yakında bu sayfada yer alacaktır. Etkinlik
            gerçekleştikten sonra fotoğraflar ve belgeler burada paylaşılacaktır.
          </p>
        </aside>
      )}
    </main>
  );
}
