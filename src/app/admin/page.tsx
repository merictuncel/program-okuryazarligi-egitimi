import Link from "next/link";
import { requireAdminPage } from "@/lib/admin";
import {
  getAllAnnouncements,
  getAllDocuments,
  getAllFaqItems,
  getAllGalleryImages,
  getAllProgramSessions,
  getInstructors,
  getSiteSettings,
} from "@/lib/data";

export default async function AdminDashboardPage() {
  const session = await requireAdminPage();
  const [
    settings,
    instructors,
    announcements,
    programSessions,
    faqItems,
    documents,
    galleryImages,
  ] = await Promise.all([
    getSiteSettings(),
    getInstructors(),
    getAllAnnouncements(),
    getAllProgramSessions(),
    getAllFaqItems(),
    getAllDocuments(),
    getAllGalleryImages(),
  ]);

  return (
    <main className="px-4 py-8 sm:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900">Yönetim Özeti</h1>
        <p className="mt-1 text-slate-600">Hoş geldiniz, {session.user.email}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Site başlığı</p>
          <p className="mt-2 font-medium text-slate-900">
            {settings?.title ?? "Ayarlanmadı"}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Program oturumu</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {programSessions.length}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Eğitmen sayısı</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {instructors.length}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Duyuru sayısı</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {announcements.length}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">SSS</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {faqItems.length}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Belgeler</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {documents.length}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Galeri</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {galleryImages.length}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/settings"
          className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 hover:ring-slate-400"
        >
          <h2 className="font-semibold text-slate-900">Site Ayarları</h2>
          <p className="mt-2 text-sm text-slate-600">
            Metinler, KVKK, ulaşım
          </p>
        </Link>
        <Link
          href="/admin/basvuru"
          className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 hover:ring-slate-400"
        >
          <h2 className="font-semibold text-slate-900">Başvuru</h2>
          <p className="mt-2 text-sm text-slate-600">
            Koşullar metni ve Google Form linki
          </p>
        </Link>
        <Link
          href="/admin/program"
          className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 hover:ring-slate-400"
        >
          <h2 className="font-semibold text-slate-900">Program</h2>
          <p className="mt-2 text-sm text-slate-600">
            Günler, oturumlar, eğitmenler ve saatler
          </p>
        </Link>
        <Link
          href="/admin/instructors"
          className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 hover:ring-slate-400"
        >
          <h2 className="font-semibold text-slate-900">Eğitmenler</h2>
          <p className="mt-2 text-sm text-slate-600">
            Ekle, düzenle, sil ve fotoğraf yükle
          </p>
        </Link>
        <Link
          href="/admin/announcements"
          className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 hover:ring-slate-400"
        >
          <h2 className="font-semibold text-slate-900">Duyurular</h2>
          <p className="mt-2 text-sm text-slate-600">
            Pop-up ve sayfa bağlantılı duyurular
          </p>
        </Link>
        <Link
          href="/admin/faq"
          className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 hover:ring-slate-400"
        >
          <h2 className="font-semibold text-slate-900">SSS</h2>
          <p className="mt-2 text-sm text-slate-600">
            Sıkça sorulan sorular yönetimi
          </p>
        </Link>
        <Link
          href="/admin/documents"
          className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 hover:ring-slate-400"
        >
          <h2 className="font-semibold text-slate-900">Belgeler</h2>
          <p className="mt-2 text-sm text-slate-600">
            PDF yükleme ve indirme listesi
          </p>
        </Link>
        <Link
          href="/admin/gallery"
          className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 hover:ring-slate-400"
        >
          <h2 className="font-semibold text-slate-900">Galeri</h2>
          <p className="mt-2 text-sm text-slate-600">
            Etkinlik görselleri ve sıralama
          </p>
        </Link>
      </div>
    </main>
  );
}
