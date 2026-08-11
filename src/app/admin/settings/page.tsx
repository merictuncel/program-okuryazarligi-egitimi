import { updateSiteSettingsAction } from "@/app/admin/actions";
import { ActionForm } from "@/components/ActionForm";
import { PasswordChangeForm } from "@/components/PasswordChangeForm";
import { requireAdminPage } from "@/lib/admin";
import { getSiteSettings } from "@/lib/data";

export default async function AdminSettingsPage() {
  await requireAdminPage();
  const settings = await getSiteSettings();

  return (
    <main className="px-4 py-8 sm:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900">Site Ayarları</h1>
        <p className="mt-1 text-slate-600">
          Ana sayfa metinleri, başvuru formu ve iletişim bilgileri
        </p>
      </header>

      <ActionForm
        action={updateSiteSettingsAction}
        submitLabel="Ayarları Kaydet"
        className="max-w-3xl space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
      >
        <Field
          name="title"
          label="Proje Başlığı"
          defaultValue={settings?.title}
          required
        />
        <TextArea
          name="purpose"
          label="Amaç"
          defaultValue={settings?.purpose}
          required
        />
        <TextArea
          name="scope"
          label="Kapsam"
          defaultValue={settings?.scope}
          required
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1 text-sm">
            <span className="font-medium text-slate-700">Başlangıç Tarihi</span>
            <input
              name="startDate"
              type="text"
              defaultValue={settings?.startDate ?? ""}
              placeholder="örn. 11-17 Ocak 2027"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            />
            <span className="text-xs text-slate-500">
              Önerilen biçim: GG-AA YYYY veya GG-GG Ay YYYY
            </span>
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium text-slate-700">Bitiş Tarihi</span>
            <input
              name="endDate"
              type="text"
              defaultValue={settings?.endDate ?? ""}
              placeholder="opsiyonel"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            />
          </label>
        </div>
        <Field
          name="location"
          label="Yer"
          defaultValue={settings?.location}
        />
        <TextArea
          name="organizingCommittee"
          label="Düzenleme Kurulu"
          defaultValue={settings?.organizingCommittee}
        />
        <TextArea
          name="scientificCommittee"
          label="Bilim Kurulu"
          defaultValue={settings?.scientificCommittee}
        />
        <Field
          name="applicationFormUrl"
          label="Google Form Başvuru Linki"
          defaultValue={settings?.applicationFormUrl}
          type="text"
        />

        <div className="border-t border-slate-200 pt-6">
          <h2 className="text-lg font-semibold text-slate-900">
            İletişim Bilgileri
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            /iletisim sayfasında görünen proje yürütücüsü bilgileri
          </p>
        </div>
        <Field
          name="contactName"
          label="Ad Soyad"
          defaultValue={settings?.contactName}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            name="contactTitle"
            label="Unvan"
            defaultValue={settings?.contactTitle}
          />
          <Field
            name="contactRole"
            label="Görev / Rol"
            defaultValue={settings?.contactRole}
          />
        </div>
        <Field
          name="contactEmail"
          label="E-posta"
          defaultValue={settings?.contactEmail}
          type="email"
        />
        <Field
          name="contactPhone"
          label="Telefon (opsiyonel)"
          defaultValue={settings?.contactPhone}
        />
        <TextArea
          name="contactInstitution"
          label="Kurum / Birim"
          defaultValue={settings?.contactInstitution}
        />
        <TextArea
          name="contactNote"
          label="İletişim Notu"
          defaultValue={settings?.contactNote}
        />

        <div className="border-t border-slate-200 pt-6">
          <h2 className="text-lg font-semibold text-slate-900">
            İçerik Sayfaları
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Başvuru koşulları, KVKK, ulaşım ve galeri bilgilendirme metinleri
          </p>
        </div>
        <TextArea
          name="applicationCriteria"
          label="Başvuru Koşulları"
          defaultValue={settings?.applicationCriteria}
          rows={8}
        />
        <TextArea
          name="kvkkText"
          label="KVKK Metni"
          defaultValue={settings?.kvkkText}
          rows={8}
        />
        <TextArea
          name="travelInfo"
          label="Ulaşım ve Konaklama"
          defaultValue={settings?.travelInfo}
          rows={8}
        />
        <TextArea
          name="certificateInfo"
          label="Sertifika / Galeri Bilgilendirme"
          defaultValue={settings?.certificateInfo}
          rows={5}
        />
      </ActionForm>

      <PasswordChangeForm />
    </main>
  );
}

function Field({
  name,
  label,
  defaultValue,
  required,
  type = "text",
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block space-y-1 text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        required={required}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
      />
    </label>
  );
}

function TextArea({
  name,
  label,
  defaultValue,
  required,
  rows = 4,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  required?: boolean;
  rows?: number;
}) {
  return (
    <label className="block space-y-1 text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue ?? ""}
        required={required}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
      />
    </label>
  );
}
