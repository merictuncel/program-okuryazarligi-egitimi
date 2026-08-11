"use client";

import { useState } from "react";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  if (items.length === 0) return null;

  return (
    <div className="mt-10 space-y-3">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <article key={item.id} className="card-static overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenId(open ? null : item.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
              aria-expanded={open}
            >
              <span className="font-medium text-navy">{item.question}</span>
              <span
                className={`shrink-0 text-silver-muted transition ${open ? "rotate-45" : ""}`}
                aria-hidden
              >
                +
              </span>
            </button>
            {open ? (
              <div className="border-t border-line px-5 py-4 sm:px-6">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted sm:text-[0.95rem]">
                  {item.answer}
                </p>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
