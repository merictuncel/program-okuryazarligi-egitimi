import { DocumentManager } from "@/components/DocumentManager";
import { requireAdminPage } from "@/lib/admin";
import { getAllDocuments } from "@/lib/data";

export default async function AdminDocumentsPage() {
  await requireAdminPage();
  const documents = await getAllDocuments();

  return (
    <main className="px-4 py-8 sm:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900">Belgeler</h1>
        <p className="mt-1 text-slate-600">
          PDF belge yükleme ve indirme listesi yönetimi
        </p>
      </header>
      <DocumentManager documents={documents} />
    </main>
  );
}
