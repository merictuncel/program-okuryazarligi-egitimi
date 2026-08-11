"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  createGalleryImageAction,
  deleteGalleryImageAction,
  updateGalleryImageAction,
} from "@/app/admin/actions";
import { ActionForm } from "@/components/ActionForm";

type GalleryImage = {
  id: string;
  title?: string | null;
  caption?: string | null;
  imageUrl: string;
  order: number;
  isActive: boolean;
};

export function GalleryManager({ images }: { images: GalleryImage[] }) {
  const router = useRouter();

  async function onDelete(id: string) {
    if (!confirm("Bu görseli silmek istediğinize emin misiniz?")) return;
    const result = await deleteGalleryImageAction(id);
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
        action={createGalleryImageAction}
        submitLabel="Görsel Ekle"
        className="space-y-3 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
        onSuccess={() => router.refresh()}
      >
        <h2 className="text-lg font-semibold text-slate-900">Yeni Görsel</h2>
        <p className="text-xs text-slate-500">
          JPEG, PNG veya WEBP · en fazla 8 MB · kart için otomatik 4:3 kırpılır
        </p>
        <input
          name="title"
          placeholder="Başlık (opsiyonel)"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <textarea
          name="caption"
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
          <span className="font-medium">Görsel (JPEG / PNG / WEBP)</span>
          <input
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
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
        {images.map((item) => (
          <li
            key={item.id}
            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
          >
            <ActionForm
              action={updateGalleryImageAction}
              submitLabel="Güncelle"
              className="space-y-3"
              onSuccess={() => router.refresh()}
            >
              <input type="hidden" name="id" value={item.id} />
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.title ?? "Galeri"}
                    className="h-20 w-28 rounded-xl object-cover ring-1 ring-slate-200"
                  />
                  <p className="text-sm text-slate-600">
                    {item.title || "Başlıksız"}
                    {item.isActive ? "" : " · Pasif"}
                  </p>
                </div>
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
                defaultValue={item.title ?? ""}
                placeholder="Başlık"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <textarea
                name="caption"
                defaultValue={item.caption ?? ""}
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
              <label className="block space-y-1 text-sm text-slate-700">
                <span className="font-medium">Yeni görsel (opsiyonel)</span>
                <input
                  name="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
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
