"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  createDocumentAction,
  deleteDocumentAction,
  updateDocumentAction,
} from "@/app/admin/actions";
import { ActionForm } from "@/components/ActionForm";

type SiteDocument = {
  id: string;
  title: string;
  description?: string | null;
  fileUrl: string;
  fileName?: string | null;
  order: number;
  isActive: boolean;
};

export function DocumentManager({ documents }: { documents: SiteDocument[] }) {
  const router = useRouter();

  async function onDelete(id: string) {
    if (!confirm("Bu belgeyi silmek istediğinize emin misiniz?")) return;
    const result = await deleteDocumentAction(id);
    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div className="space-y-8">
      <ActionForm
        action={createDocumentAction}
        submitLabel="Belge Ekle"
        className="space-y-3 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
        onSuccess={() => router.refresh()}
      >
        <h2 className="text-lg font-semibold text-slate-900">Yeni Belge</h2>
        <input
          name="title"
          placeholder="Başlık"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <textarea
          name="description"
          placeholder="Açıklama (opsiyonel)"
          rows={2}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          name="order"
          type="number"
          min={0}
          defaultValue={0}
          placeholder="Sıra"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <label className="block space-y-1 text-sm text-slate-700">
          <span className="font-medium">PDF dosyası</span>
          <input
            name="file"
            type="file"
            accept="application/pdf,.pdf"
            required
            className="w-full text-sm"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input name="isActive" type="checkbox" defaultChecked />
          Aktif olarak yayınla
        </label>
      </ActionForm>

      <ul className="space-y-4">
        {documents.map((item) => (
          <li
            key={item.id}
            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
          >
            <ActionForm
              action={updateDocumentAction}
              submitLabel="Güncelle"
              className="space-y-3"
              onSuccess={() => router.refresh()}
            >
              <input type="hidden" name="id" value={item.id} />
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs text-slate-400">
                  {item.fileName ?? item.fileUrl}
                  {item.isActive ? "" : " · Pasif"}
                </p>
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Sil
                </button>
              </div>
              <input
                name="title"
                defaultValue={item.title}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <textarea
                name="description"
                defaultValue={item.description ?? ""}
                rows={2}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                name="order"
                type="number"
                min={0}
                defaultValue={item.order}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <p className="text-xs text-slate-500">
                Mevcut dosya:{" "}
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 underline"
                >
                  {item.fileName ?? "PDF"}
                </a>
              </p>
              <label className="block space-y-1 text-sm text-slate-700">
                <span className="font-medium">Yeni PDF (opsiyonel)</span>
                <input
                  name="file"
                  type="file"
                  accept="application/pdf,.pdf"
                  className="w-full text-sm"
                />
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  name="isActive"
                  type="checkbox"
                  defaultChecked={item.isActive}
                />
                Aktif olarak yayınla
              </label>
            </ActionForm>
          </li>
        ))}
      </ul>
    </div>
  );
}
