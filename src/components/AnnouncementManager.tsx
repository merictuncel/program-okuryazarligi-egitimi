"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  createAnnouncementAction,
  deleteAnnouncementAction,
  updateAnnouncementAction,
} from "@/app/admin/actions";
import { ActionForm } from "@/components/ActionForm";
import { LINK_PATH_LABELS, SAFE_INTERNAL_PATHS } from "@/lib/links";

type Announcement = {
  id: string;
  title: string;
  content: string;
  publishedAt: string | Date;
  isActive: boolean;
  showAsPopup: boolean;
  linkPath?: string | null;
};

function AnnouncementOptions({
  item,
}: {
  item?: Partial<Announcement>;
}) {
  return (
    <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          name="isActive"
          type="checkbox"
          defaultChecked={item?.isActive ?? true}
        />
        Aktif olarak yayınla
      </label>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          name="showAsPopup"
          type="checkbox"
          defaultChecked={item?.showAsPopup ?? false}
        />
        Pop-up olarak göster (site açılışında)
      </label>
      <p className="text-xs text-slate-500">
        Aynı anda yalnızca bir pop-up aktif olabilir. İçerik düz metin olarak
        gösterilir; HTML çalıştırılmaz.
      </p>
      <label className="block space-y-1 text-sm text-slate-700">
        <span className="font-medium">Sayfa bağlantısı (opsiyonel)</span>
        <select
          name="linkPath"
          defaultValue={item?.linkPath ?? ""}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">Bağlantı yok</option>
          {SAFE_INTERNAL_PATHS.map((path) => (
            <option key={path} value={path}>
              {LINK_PATH_LABELS[path]} ({path})
            </option>
          ))}
        </select>
      </label>
      <p className="text-xs text-slate-500">
        Program duyurusu için &quot;Program&quot; seçin; ziyaretçi duyurudan
        programa gidebilir.
      </p>
    </div>
  );
}

export function AnnouncementManager({
  announcements,
}: {
  announcements: Announcement[];
}) {
  const router = useRouter();

  async function onDelete(id: string) {
    if (!confirm("Bu duyuruyu silmek istediğinize emin misiniz?")) return;
    const result = await deleteAnnouncementAction(id);
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
        action={createAnnouncementAction}
        submitLabel="Duyuru Yayınla"
        className="space-y-3 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
        onSuccess={() => router.refresh()}
      >
        <h2 className="text-lg font-semibold text-slate-900">Yeni Duyuru</h2>
        <input
          name="title"
          placeholder="Başlık"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <textarea
          name="content"
          placeholder="İçerik"
          required
          rows={4}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <AnnouncementOptions />
      </ActionForm>

      <ul className="space-y-4">
        {announcements.map((item) => (
          <li
            key={item.id}
            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
          >
            <ActionForm
              action={updateAnnouncementAction}
              submitLabel="Güncelle"
              className="space-y-3"
              onSuccess={() => router.refresh()}
            >
              <input type="hidden" name="id" value={item.id} />
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs text-slate-400">
                  {new Date(item.publishedAt).toLocaleString("tr-TR")}
                  {item.showAsPopup ? " · Pop-up" : ""}
                  {item.linkPath ? ` · ${item.linkPath}` : ""}
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
                name="content"
                defaultValue={item.content}
                required
                rows={4}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <AnnouncementOptions item={item} />
            </ActionForm>
          </li>
        ))}
      </ul>
    </div>
  );
}
