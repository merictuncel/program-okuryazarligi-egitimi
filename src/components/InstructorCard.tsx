"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { ModalShell } from "@/components/ModalShell";

type InstructorItem = {
  id: string;
  name: string;
  title: string;
  biography: string;
  photoUrl?: string | null;
};

function Initials({ name }: { name: string }) {
  return (
    <>
      {name
        .split(" ")
        .slice(0, 2)
        .map((part) => part[0])
        .join("")}
    </>
  );
}

export function InstructorCard({ item }: { item: InstructorItem }) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="card w-full overflow-hidden p-0 text-left transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        <div className="relative aspect-square bg-silver-soft">
          {item.photoUrl ? (
            <Image
              src={item.photoUrl}
              alt={item.name}
              fill
              className="object-cover object-top"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-navy-deep to-navy-mid text-2xl font-bold text-silver">
              <Initials name={item.name} />
            </div>
          )}
        </div>
        <div className="p-3 sm:p-3.5">
          <p className="line-clamp-1 text-[0.65rem] font-semibold tracking-[0.1em] text-accent uppercase">
            {item.title}
          </p>
          <h2 className="mt-0.5 line-clamp-2 text-sm font-bold text-navy sm:text-[0.95rem]">
            {item.name}
          </h2>
        </div>
      </button>
      <ModalShell open={open} onClose={() => setOpen(false)} labelledBy={titleId}>
        <div className="p-5 sm:p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative h-36 w-36 overflow-hidden rounded-2xl bg-silver-soft ring-1 ring-line sm:h-40 sm:w-40">
              {item.photoUrl ? (
                <Image
                  src={item.photoUrl}
                  alt={item.name}
                  fill
                  className="object-cover object-top"
                  sizes="160px"
                  unoptimized
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-navy-deep to-navy-mid text-3xl font-bold text-silver">
                  <Initials name={item.name} />
                </div>
              )}
            </div>
            <p className="mt-4 text-xs font-semibold tracking-[0.12em] text-accent uppercase">
              {item.title}
            </p>
            <h3 id={titleId} className="mt-1 text-xl font-bold text-navy">
              {item.name}
            </h3>
          </div>
          <p className="mt-4 whitespace-pre-wrap text-left text-sm leading-relaxed text-muted">
            {item.biography}
          </p>
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="btn btn-primary !px-4 !py-2"
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

export function InstructorGrid({
  instructors,
}: {
  instructors: InstructorItem[];
}) {
  if (instructors.length === 0) {
    return <p className="mt-12 text-muted">Henüz eğitmen kaydı bulunmuyor.</p>;
  }

  return (
    <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
      {instructors.map((item) => (
        <InstructorCard key={item.id} item={item} />
      ))}
    </div>
  );
}
