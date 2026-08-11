"use client";

import { useMemo, useState } from "react";

export type ProgramSessionView = {
  id: string;
  dayLabel: string;
  title: string;
  instructorName?: string | null;
  timeLabel?: string | null;
  location?: string | null;
  description?: string | null;
};

export function ProgramSchedule({
  sessions,
}: {
  sessions: ProgramSessionView[];
}) {
  const dayKeys = useMemo(() => {
    const keys: string[] = [];
    for (const item of sessions) {
      if (!keys.includes(item.dayLabel)) keys.push(item.dayLabel);
    }
    return keys;
  }, [sessions]);

  const [activeDay, setActiveDay] = useState(dayKeys[0] ?? "");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const selectedDay = dayKeys.includes(activeDay) ? activeDay : dayKeys[0] ?? "";
  const daySessions = sessions.filter((s) => s.dayLabel === selectedDay);

  if (dayKeys.length === 0) return null;

  return (
    <div className="mt-10">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
            Takvim
          </p>
          <p className="mt-1 text-sm text-muted">
            {sessions.length} oturum · {dayKeys.length} gün
          </p>
        </div>
      </div>

      <div
        className="mt-5 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Etkinlik günleri"
      >
        {dayKeys.map((day, index) => {
          const active = day === selectedDay;
          const count = sessions.filter((s) => s.dayLabel === day).length;
          return (
            <button
              key={day}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                setActiveDay(day);
                setExpandedId(null);
              }}
              className={`shrink-0 rounded-xl px-4 py-2.5 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
                active
                  ? "bg-navy text-white shadow-sm"
                  : "bg-white text-ink ring-1 ring-line hover:bg-silver-soft"
              }`}
            >
              <span className="block text-[0.65rem] font-semibold tracking-wide uppercase opacity-80">
                Gün {index + 1}
              </span>
              <span className="mt-0.5 block max-w-[14rem] truncate text-sm font-semibold">
                {day}
              </span>
              <span
                className={`mt-0.5 block text-xs ${active ? "text-silver" : "text-muted"}`}
              >
                {count} oturum
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_4px_18px_rgba(10,37,64,0.06)]">
        <div className="border-b border-line bg-silver-soft/60 px-4 py-3 sm:px-5">
          <h2 className="font-serif text-lg font-bold text-navy sm:text-xl">
            {selectedDay}
          </h2>
        </div>

        <ul className="divide-y divide-line" role="list">
          {daySessions.map((item) => {
            const hasDesc = Boolean(item.description?.trim());
            const open = expandedId === item.id;

            return (
              <li key={item.id}>
                <div className="grid gap-3 px-4 py-4 sm:grid-cols-[7.5rem_1fr_auto] sm:items-start sm:gap-5 sm:px-5 sm:py-4">
                  <div className="sm:pt-0.5">
                    {item.timeLabel ? (
                      <p className="text-sm font-bold tabular-nums text-accent">
                        {item.timeLabel}
                      </p>
                    ) : (
                      <p className="text-sm text-silver-muted">Saat yok</p>
                    )}
                    {item.location ? (
                      <p className="mt-1 text-xs leading-snug text-muted">
                        {item.location}
                      </p>
                    ) : null}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-navy sm:text-[1.05rem]">
                      {item.title}
                    </h3>
                    {item.instructorName ? (
                      <p className="mt-1 text-sm text-muted">
                        <span className="text-silver-muted">Eğitmen · </span>
                        <span className="font-medium text-ink">
                          {item.instructorName}
                        </span>
                      </p>
                    ) : null}
                    {hasDesc && open ? (
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted">
                        {item.description}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex sm:justify-end">
                    {hasDesc ? (
                      <button
                        type="button"
                        className="text-sm font-semibold text-accent hover:underline"
                        aria-expanded={open}
                        onClick={() =>
                          setExpandedId(open ? null : item.id)
                        }
                      >
                        {open ? "Gizle" : "Detay"}
                      </button>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
