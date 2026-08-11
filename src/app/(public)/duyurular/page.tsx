import type { Metadata } from "next";
import { AnnouncementList } from "@/components/AnnouncementCard";
import { getActiveAnnouncements } from "@/lib/data";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Duyurular",
  description: "Proje duyuruları ve güncel bilgilendirmeler.",
  openGraph: {
    title: `Duyurular | ${siteConfig.shortName}`,
    description: "Proje duyuruları ve güncel bilgilendirmeler.",
    url: `${siteConfig.url}/duyurular`,
    type: "website",
    locale: siteConfig.locale,
  },
};

export default async function AnnouncementsPage() {
  const announcements = await getActiveAnnouncements();

  return (
    <main id="main-content" className="container-page py-12 sm:py-16 lg:py-20">
      <header className="max-w-3xl">
        <p className="section-label">Duyurular</p>
        <h1 className="section-title !text-4xl sm:!text-5xl">Tüm Duyurular</h1>
        <div className="section-rule !w-28" />
        <p className="mt-5 text-muted">
          Proje değerlendirme süreci ve başvuru ile ilgili gelişmeler bu
          sayfadan paylaşılır.
        </p>
      </header>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <AnnouncementList announcements={announcements} />
      </div>
    </main>
  );
}
