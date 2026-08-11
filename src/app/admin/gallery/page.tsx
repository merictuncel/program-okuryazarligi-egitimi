import { GalleryManager } from "@/components/GalleryManager";
import { requireAdminPage } from "@/lib/admin";
import { getAllGalleryImages } from "@/lib/data";

export default async function AdminGalleryPage() {
  await requireAdminPage();
  const images = await getAllGalleryImages();

  return (
    <main className="px-4 py-8 sm:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900">Galeri</h1>
        <p className="mt-1 text-slate-600">
          Etkinlik görselleri — yükle, düzenle ve sırala
        </p>
      </header>
      <GalleryManager images={images} />
    </main>
  );
}
