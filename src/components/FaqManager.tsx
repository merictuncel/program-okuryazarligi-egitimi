"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  createFaqItemAction,
  deleteFaqItemAction,
  updateFaqItemAction,
} from "@/app/admin/actions";
import { ActionForm } from "@/components/ActionForm";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
};

function FaqFields({ item }: { item?: Partial<FaqItem> }) {
  return (
    <>
      <input
        name="question"
        placeholder="Soru"
        defaultValue={item?.question ?? ""}
        required
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
      <textarea
        name="answer"
        placeholder="Yanıt"
        defaultValue={item?.answer ?? ""}
        required
        rows={4}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          name="order"
          type="number"
          min={0}
          defaultValue={item?.order ?? 0}
          placeholder="Sıra"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            name="isActive"
            type="checkbox"
            defaultChecked={item?.isActive ?? true}
          />
          Aktif olarak yayınla
        </label>
      </div>
    </>
  );
}

export function FaqManager({ items }: { items: FaqItem[] }) {
  const router = useRouter();

  async function onDelete(id: string) {
    if (!confirm("Bu SSS maddesini silmek istediğinize emin misiniz?")) return;
    const result = await deleteFaqItemAction(id);
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
        action={createFaqItemAction}
        submitLabel="SSS Ekle"
        className="space-y-3 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
        onSuccess={() => router.refresh()}
      >
        <h2 className="text-lg font-semibold text-slate-900">Yeni SSS</h2>
        <FaqFields />
      </ActionForm>

      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
          >
            <ActionForm
              action={updateFaqItemAction}
              submitLabel="Güncelle"
              className="space-y-3"
              onSuccess={() => router.refresh()}
            >
              <input type="hidden" name="id" value={item.id} />
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs text-slate-400">
                  Sıra: {item.order}
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
              <FaqFields item={item} />
            </ActionForm>
          </li>
        ))}
      </ul>
    </div>
  );
}
