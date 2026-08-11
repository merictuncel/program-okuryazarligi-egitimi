"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  createInstructorAction,
  deleteInstructorAction,
  updateInstructorAction,
} from "@/app/admin/actions";
import { ActionForm } from "@/components/ActionForm";
import { PhotoCropField } from "@/components/PhotoCropField";

type Instructor = {
  id: string;
  name: string;
  title: string;
  biography: string;
  photoUrl?: string | null;
  order: number;
};

export function InstructorManager({
  instructors,
}: {
  instructors: Instructor[];
}) {
  const router = useRouter();

  async function onDelete(id: string) {
    if (!confirm("Bu eğitmeni silmek istediğinize emin misiniz?")) return;
    const result = await deleteInstructorAction(id);
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
        action={createInstructorAction}
        submitLabel="Eğitmen Ekle"
        className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
        onSuccess={() => router.refresh()}
      >
        <h2 className="text-lg font-semibold text-slate-900">Yeni Eğitmen</h2>
        <input
          name="name"
          placeholder="Ad Soyad"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          name="title"
          placeholder="Unvan"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <textarea
          name="biography"
          placeholder="Biyografi"
          required
          rows={3}
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
        <div>
          <p className="mb-2 text-sm font-medium text-slate-700">Fotoğraf</p>
          <PhotoCropField name="photo" />
        </div>
      </ActionForm>

      <ul className="space-y-4">
        {instructors.map((item) => (
          <li
            key={item.id}
            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
          >
            <ActionForm
              action={updateInstructorAction}
              submitLabel="Güncelle"
              className="space-y-4"
              onSuccess={() => router.refresh()}
            >
              <input type="hidden" name="id" value={item.id} />
              <input type="hidden" name="photoUrl" value={item.photoUrl ?? ""} />
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {item.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.photoUrl}
                      alt={item.name}
                      className="h-20 w-20 rounded-xl object-cover object-top ring-1 ring-slate-200"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-500">
                      Foto yok
                    </div>
                  )}
                  <p className="font-medium text-slate-900">
                    {item.title} {item.name}
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
                name="name"
                defaultValue={item.name}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                name="title"
                defaultValue={item.title}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <textarea
                name="biography"
                defaultValue={item.biography}
                required
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                name="order"
                type="number"
                min={0}
                defaultValue={item.order}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <div>
                <p className="mb-2 text-sm font-medium text-slate-700">
                  Yeni fotoğraf (opsiyonel)
                </p>
                <PhotoCropField name="photo" />
              </div>
            </ActionForm>
          </li>
        ))}
      </ul>
    </div>
  );
}
