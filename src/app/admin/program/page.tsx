import { ProgramManager } from "@/components/ProgramManager";
import { requireAdminPage } from "@/lib/admin";
import { getAllProgramSessions } from "@/lib/data";

export default async function AdminProgramPage() {
  await requireAdminPage();
  const sessions = await getAllProgramSessions();

  return (
    <main className="px-4 py-8 sm:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900">Program</h1>
        <p className="mt-1 text-slate-600">
          Etkinlik günleri, oturum başlıkları, eğitmenler ve eğitim saatleri
        </p>
      </header>
      <ProgramManager sessions={sessions} />
    </main>
  );
}
