import type { Metadata } from "next";
import { PrintButton } from "@/components/PrintButton";
import { ProgramSchedule } from "@/components/ProgramSchedule";
import { getActiveProgramSessions } from "@/lib/data";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Program",
  description:
    "Etkinlik günleri, oturum başlıkları, eğitmenler ve eğitim saatleri.",
  openGraph: {
    title: `Program | ${siteConfig.shortName}`,
    description:
      "Etkinlik günleri, oturum başlıkları, eğitmenler ve eğitim saatleri.",
    url: `${siteConfig.url}/program`,
    type: "website",
    locale: siteConfig.locale,
  },
};

export default async function ProgramPage() {
  const sessions = await getActiveProgramSessions();
  const hasSessions = sessions.length > 0;

  return (
    <main
      id="main-content"
      className="program-print-page container-page py-12 sm:py-16 lg:py-20"
    >
      <header className="flex max-w-3xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-label">Etkinlik</p>
          <h1 className="section-title !text-4xl sm:!text-5xl">Program</h1>
          <div className="section-rule !w-28" />
          {hasSessions ? (
            <p className="mt-5 text-muted">
              Etkinlik günlerini seçerek oturum başlıklarını, eğitmenleri ve
              eğitim saatlerini inceleyebilirsiniz.
            </p>
          ) : (
            <p className="mt-5 text-muted">
              Etkinlik günleri, oturum başlıkları, eğitmenler ve eğitim saatleri bu
              sayfada yer alacaktır.
            </p>
          )}
        </div>
        {hasSessions ? (
          <PrintButton label="Programı Yazdır" className="shrink-0 self-start sm:self-auto" />
        ) : null}
      </header>

      {!hasSessions ? (
        <>
          <aside className="mt-8 max-w-3xl rounded-2xl border border-navy/10 bg-silver-soft/80 px-5 py-4 sm:px-6 sm:py-5">
            <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
              Bilgilendirme
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink sm:text-[0.95rem]">
              Detaylı program, proje değerlendirme sürecinin tamamlanmasının
              ardından bu sayfada yayımlanacaktır. Güncel gelişmeler için
              duyuruları takip edebilirsiniz.
            </p>
          </aside>
          <p className="mt-10 max-w-2xl text-sm text-muted sm:text-base">
            Şu an için yayımlanmış bir oturum bulunmamaktadır. Program
            kesinleştiğinde etkinlik takvimi burada paylaşılacaktır.
          </p>
        </>
      ) : (
        <ProgramSchedule
          sessions={sessions.map((item) => ({
            id: item.id,
            dayLabel: item.dayLabel,
            title: item.title,
            instructorName: item.instructorName,
            timeLabel: item.timeLabel,
            location: item.location,
            description: item.description,
          }))}
        />
      )}
    </main>
  );
}
