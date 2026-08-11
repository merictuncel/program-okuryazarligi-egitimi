"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { ModalShell } from "@/components/ModalShell";
import { formatDateTr } from "@/lib/format";
import { isSafeInternalPath, LINK_PATH_LABELS } from "@/lib/links";

type PopupAnnouncement = {
  id: string;
  title: string;
  content: string;
  publishedAt: string | Date;
  linkPath?: string | null;
};

export function AnnouncementPopup({
  announcement,
}: {
  announcement: PopupAnnouncement | null;
}) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!announcement) {
      setOpen(false);
      return;
    }
    // Her sayfa yüklemesinde göster; "Anladım" yalnızca bu oturum görünümünü kapatır.
    // Kalıcı saklama yok — yenileme veya siteye yeniden girişte tekrar açılır.
    setOpen(true);
  }, [announcement?.id]);

  function dismiss() {
    setOpen(false);
  }

  if (!announcement) return null;

  const safeLink = isSafeInternalPath(announcement.linkPath)
    ? announcement.linkPath
    : null;

  return (
    <ModalShell
      open={open}
      onClose={dismiss}
      labelledBy={titleId}
      maxWidthClass="max-w-lg"
    >
      <div className="p-6 sm:p-7">
        <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
          Duyuru
        </p>
        <time className="mt-2 block text-xs text-muted">
          {formatDateTr(announcement.publishedAt)}
        </time>
        <h2 id={titleId} className="mt-2 text-xl font-bold text-navy">
          {announcement.title}
        </h2>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-muted">
          {announcement.content}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
          {safeLink ? (
            <Link
              href={safeLink}
              className="btn btn-primary !px-4 !py-2"
              onClick={dismiss}
            >
              {LINK_PATH_LABELS[safeLink]} sayfasına git
            </Link>
          ) : null}
          <button
            type="button"
            className={
              safeLink
                ? "btn btn-secondary !px-4 !py-2"
                : "btn btn-primary !px-4 !py-2"
            }
            onClick={dismiss}
          >
            Anladım
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
