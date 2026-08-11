import { AnnouncementManager } from "@/components/AnnouncementManager";
import { requireAdminPage } from "@/lib/admin";
import { getAllAnnouncements } from "@/lib/data";

export default async function AdminAnnouncementsPage() {
  await requireAdminPage();
  const announcements = await getAllAnnouncements();

  return (
    <main className="px-4 py-8 sm:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900">Duyurular</h1>
        <p className="mt-1 text-slate-600">
          Pop-up ve Program sayfası bağlantısı dahil duyuru yönetimi
        </p>
      </header>
      <AnnouncementManager announcements={announcements} />
    </main>
  );
}
