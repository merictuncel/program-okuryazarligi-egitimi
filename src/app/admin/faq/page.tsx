import { FaqManager } from "@/components/FaqManager";
import { requireAdminPage } from "@/lib/admin";
import { getAllFaqItems } from "@/lib/data";

export default async function AdminFaqPage() {
  await requireAdminPage();
  const items = await getAllFaqItems();

  return (
    <main className="px-4 py-8 sm:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900">SSS</h1>
        <p className="mt-1 text-slate-600">
          Sıkça sorulan sorular — ekle, düzenle, sırala ve yayımla
        </p>
      </header>
      <FaqManager items={items} />
    </main>
  );
}
