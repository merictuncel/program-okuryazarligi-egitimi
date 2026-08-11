import { updateApplicationPageAction } from "@/app/admin/actions";
import { ActionForm } from "@/components/ActionForm";
import { requireAdminPage } from "@/lib/admin";
import { getSiteSettings } from "@/lib/data";

export default async function AdminApplicationPage() {
  await requireAdminPage();
  const settings = await getSiteSettings();

  return (
    <main className="px-4 py-8 sm:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900">Başvuru</h1>
        <p className="mt-1 text-slate-600">
          Başvuru koşulları metni ve Google Form bağlantısı
        </p>
      </header>

      <ActionForm
        action={updateApplicationPageAction}
        submitLabel="Başvuru Bilgilerini Kaydet"
        className="max-w-3xl space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
      >
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-slate-700">
            Google Form Başvuru Linki
          </span>
          <input
            name="applicationFormUrl"
            type="url"
            defaultValue={settings?.applicationFormUrl ?? ""}
            placeholder="https://forms.google.com/..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          />
          <span className="text-xs text-slate-500">
            Boş veya # bırakılırsa sitede bilgilendirme penceresi gösterilir.
          </span>
        </label>

        <label className="block space-y-1 text-sm">
          <span className="font-medium text-slate-700">Başvuru Koşulları</span>
          <textarea
            name="applicationCriteria"
            rows={14}
            defaultValue={settings?.applicationCriteria ?? ""}
            placeholder="Kimler başvurabilir, kontenjan, belgeler, son tarih..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          />
          <span className="text-xs text-slate-500">
            Bu metin /basvuru-kosullari sayfasında yayınlanır.
          </span>
        </label>
      </ActionForm>
    </main>
  );
}
