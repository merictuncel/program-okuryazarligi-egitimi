"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  createProgramSessionAction,
  deleteProgramSessionAction,
  updateProgramSessionAction,
} from "@/app/admin/actions";
import { ActionForm } from "@/components/ActionForm";

type ProgramSession = {
  id: string;
  dayLabel: string;
  title: string;
  instructorName?: string | null;
  timeLabel?: string | null;
  location?: string | null;
  description?: string | null;
  order: number;
  isActive: boolean;
};

function SessionFields({
  item,
}: {
  item?: Partial<ProgramSession>;
}) {
  return (
    <>
      <input
        name="dayLabel"
        placeholder="Gün / tarih (örn. 1. Gün · 11 Ocak 2027)"
        defaultValue={item?.dayLabel ?? ""}
        required
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
      <input
        name="title"
        placeholder="Program / oturum başlığı"
        defaultValue={item?.title ?? ""}
        required
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          name="instructorName"
          placeholder="Eğitmen"
          defaultValue={item?.instructorName ?? ""}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          name="timeLabel"
          placeholder="Saat (örn. 09:00–12:00)"
          defaultValue={item?.timeLabel ?? ""}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <input
        name="location"
        placeholder="Salon / yer (opsiyonel)"
        defaultValue={item?.location ?? ""}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
      <textarea
        name="description"
        placeholder="Açıklama (opsiyonel)"
        defaultValue={item?.description ?? ""}
        rows={3}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
      <div className="flex flex-wrap items-center gap-4">
        <input
          name="order"
          type="number"
          min={0}
          defaultValue={item?.order ?? 0}
          placeholder="Sıra"
          className="w-28 rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            name="isActive"
            type="checkbox"
            defaultChecked={item?.isActive ?? true}
          />
          Aktif (sitede görünsün)
        </label>
      </div>
    </>
  );
}

export function ProgramManager({
  sessions,
}: {
  sessions: ProgramSession[];
}) {
  const router = useRouter();

  async function onDelete(id: string) {
    if (!confirm("Bu program oturumunu silmek istediğinize emin misiniz?")) {
      return;
    }
    const result = await deleteProgramSessionAction(id);
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
        action={createProgramSessionAction}
        submitLabel="Oturum Ekle"
        className="space-y-3 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
        onSuccess={() => router.refresh()}
      >
        <h2 className="text-lg font-semibold text-slate-900">Yeni Oturum</h2>
        <p className="text-sm text-slate-500">
          Etkinlik günleri, başlıklar, eğitmenler ve saatler burada yönetilir.
        </p>
        <SessionFields />
      </ActionForm>

      <ul className="space-y-4">
        {sessions.length === 0 ? (
          <li className="rounded-2xl bg-white p-5 text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">
            Henüz program oturumu yok. Etkinlik takvimi netleşince buradan
            ekleyebilirsiniz.
          </li>
        ) : (
          sessions.map((item) => (
            <li
              key={item.id}
              className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
            >
              <ActionForm
                action={updateProgramSessionAction}
                submitLabel="Güncelle"
                className="space-y-3"
                onSuccess={() => router.refresh()}
              >
                <input type="hidden" name="id" value={item.id} />
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs text-slate-400">
                    Sıra: {item.order}
                    {!item.isActive ? " · Pasif" : ""}
                  </p>
                  <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Sil
                  </button>
                </div>
                <SessionFields item={item} />
              </ActionForm>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
