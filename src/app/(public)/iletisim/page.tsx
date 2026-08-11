import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data";
import { siteConfig } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const name = settings?.contactName ?? "Proje Yürütücüsü";

  return {
    title: "İletişim",
    description: `${name} ile iletişim bilgileri.`,
    openGraph: {
      title: `İletişim | ${siteConfig.shortName}`,
      description: `${name} ile iletişim bilgileri.`,
      url: `${siteConfig.url}/iletisim`,
      type: "website",
      locale: siteConfig.locale,
    },
  };
}

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const name = settings?.contactName?.trim() || null;
  const title = settings?.contactTitle?.trim() || null;
  const role = settings?.contactRole?.trim() || null;
  const email = settings?.contactEmail?.trim() || null;
  const phone = settings?.contactPhone?.trim() || null;
  const institution = settings?.contactInstitution?.trim() || null;
  const note =
    settings?.contactNote?.trim() ||
    "Proje ile ilgili soru ve taleplerinizi proje yürütücüsüne iletebilirsiniz.";

  const hasContact = Boolean(name || email || phone || institution);

  return (
    <main id="main-content" className="container-page py-12 sm:py-16 lg:py-20">
      <header className="max-w-3xl">
        <p className="section-label">İletişim</p>
        <h1 className="section-title !text-4xl sm:!text-5xl">Bize Ulaşın</h1>
        <div className="section-rule !w-28" />
        <p className="mt-5 text-muted">{note}</p>
      </header>

      <section className="mt-10 max-w-2xl">
        {!hasContact ? (
          <article className="card-static p-6 sm:p-8">
            <p className="text-sm leading-relaxed text-muted">
              İletişim bilgileri henüz yayınlanmamıştır. Güncellemeler için
              duyuruları takip edebilirsiniz.
            </p>
          </article>
        ) : (
          <article className="card-static p-6 sm:p-8">
            {role ? (
              <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
                {role}
              </p>
            ) : null}
            {(title || name) && (
              <h2 className="mt-2 text-2xl font-bold text-navy">
                {[title, name].filter(Boolean).join(" ")}
              </h2>
            )}
            {institution ? (
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {institution}
              </p>
            ) : null}

            <dl className="mt-8 space-y-5">
              {email ? (
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-navy uppercase">
                    E-posta
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={`mailto:${email}`}
                      className="text-base font-medium text-accent underline-offset-2 hover:underline"
                    >
                      {email}
                    </a>
                  </dd>
                </div>
              ) : null}

              {phone ? (
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-navy uppercase">
                    Telefon
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      className="text-base font-medium text-ink hover:text-accent"
                    >
                      {phone}
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>

            {email ? (
              <a
                href={`mailto:${email}?subject=${encodeURIComponent("Program Okuryazarlığı Eğitimi - Bilgi Talebi")}`}
                className="btn btn-primary mt-8"
              >
                E-posta Gönder
              </a>
            ) : null}
          </article>
        )}
      </section>
    </main>
  );
}
