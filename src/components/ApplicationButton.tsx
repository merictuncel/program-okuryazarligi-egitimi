"use client";

import { useId, useState } from "react";
import { isApplicationOpen } from "@/lib/application";
import { ModalShell } from "@/components/ModalShell";

const INFO_MESSAGE =
  "Başvurular proje değerlendirme sonucuna göre ilerleyen dönemde açılacaktır. Lütfen duyuruları takip ediniz.";

type Variant = "primary" | "light" | "ghost" | "nav";

const variantClass: Record<Variant, string> = {
  primary: "btn btn-primary",
  light: "btn btn-light",
  ghost: "btn btn-ghost",
  nav: "btn btn-primary !px-4 !py-2",
};

export function ApplicationButton({
  applicationFormUrl,
  label = "Başvuru Yap",
  variant = "primary",
  className = "",
}: {
  applicationFormUrl?: string | null;
  label?: string;
  variant?: Variant;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const openForm = isApplicationOpen(applicationFormUrl);
  const classes = `${variantClass[variant]} ${className}`.trim();

  if (openForm) {
    return (
      <a
        href={applicationFormUrl!}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {label}
      </a>
    );
  }

  return (
    <>
      <button type="button" className={classes} onClick={() => setOpen(true)}>
        {label}
      </button>
      <ModalShell open={open} onClose={() => setOpen(false)} labelledBy={titleId}>
        <div className="p-6">
          <p
            id={titleId}
            className="text-xs font-semibold tracking-[0.14em] text-accent uppercase"
          >
            Bilgilendirme
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink sm:text-[0.95rem]">
            {INFO_MESSAGE}
          </p>
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="btn btn-primary !px-4 !py-2"
              onClick={() => setOpen(false)}
            >
              Anladım
            </button>
          </div>
        </div>
      </ModalShell>
    </>
  );
}
