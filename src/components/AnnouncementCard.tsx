"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { formatDateTr } from "@/lib/format";
import { isSafeInternalPath, LINK_PATH_LABELS } from "@/lib/links";
import { ModalShell } from "@/components/ModalShell";

type AnnouncementItem = {
  id: string;
  title: string;
  content: string;
  publishedAt: string | Date;
  linkPath?: string | null;
};

export function AnnouncementCard({ item }: { item: AnnouncementItem }) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const safeLink = isSafeInternalPath(item.linkPath) ? item.linkPath : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="card w-full p-5 text-left sm:p-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        <time className="text-xs font-semibold tracking-wide text-accent uppercase">
          {formatDateTr(item.publishedAt)}
        </time>
        <h3 className="mt-2 text-lg font-bold text-navy">{item.title}</h3>
        <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-muted">
          {item.content}
        </p>
        <span className="mt-4 inline-block text-sm font-semibold text-accent">
          Devamını oku
          {safeLink ? ` · ${LINK_PATH_LABELS[safeLink]}` : ""}
        </span>
      </button>
      <ModalShell
        open={open}
        onClose={() => setOpen(false)}
        labelledBy={titleId}
        maxWidthClass="max-w-lg"
      >
        <div className="p-6 sm:p-7">
          <time className="text-xs font-semibold tracking-wide text-accent uppercase">
            {formatDateTr(item.publishedAt)}
          </time>
          <h3 id={titleId} className="mt-2 text-xl font-bold text-navy">
            {item.title}
          </h3>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-muted sm:text-[0.95rem]">
            {item.content}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
            {safeLink ? (
              <Link
                href={safeLink}
                className="btn btn-primary !px-4 !py-2"
                onClick={() => setOpen(false)}
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
              onClick={() => setOpen(false)}
            >
              Kapat
            </button>
          </div>
        </div>
      </ModalShell>
    </>
  );
}

export function AnnouncementList({
  announcements,
}: {
  announcements: AnnouncementItem[];
}) {
  if (announcements.length === 0) {
    return (
      <p className="text-muted md:col-span-3">
        Şu an için yayınlanmış bir duyuru bulunmamaktadır. Gelişmeler bu
        bölümden paylaşılacaktır.
      </p>
    );
  }

  return (
    <>
      {announcements.map((item) => (
        <AnnouncementCard key={item.id} item={item} />
      ))}
    </>
  );
}
