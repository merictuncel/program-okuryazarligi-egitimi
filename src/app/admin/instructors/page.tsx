import { InstructorManager } from "@/components/InstructorManager";
import { requireAdminPage } from "@/lib/admin";
import { getInstructors } from "@/lib/data";

export default async function AdminInstructorsPage() {
  await requireAdminPage();
  const instructors = await getInstructors();

  return (
    <main className="px-4 py-8 sm:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900">Eğitmenler</h1>
        <p className="mt-1 text-slate-600">
          Eğitmen ekleme, düzenleme, silme ve fotoğraf yükleme
        </p>
      </header>
      <InstructorManager instructors={instructors} />
    </main>
  );
}
