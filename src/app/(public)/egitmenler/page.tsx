import type { Metadata } from "next";
import { InstructorGrid } from "@/components/InstructorCard";
import { getInstructors } from "@/lib/data";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Eğitmenler",
  description:
    "TÜBİTAK 2237-A kapsamında sunulmak üzere planlanan eğitim programının eğitmen kadrosu.",
  openGraph: {
    title: `Eğitmenler | ${siteConfig.shortName}`,
    description:
      "TÜBİTAK 2237-A kapsamında sunulmak üzere planlanan eğitim programının eğitmen kadrosu.",
    url: `${siteConfig.url}/egitmenler`,
    type: "website",
    locale: siteConfig.locale,
  },
};

export default async function InstructorsPage() {
  const instructors = await getInstructors();

  return (
    <main id="main-content" className="container-page py-12 sm:py-16 lg:py-20">
      <header className="max-w-3xl">
        <p className="section-label">Kadro</p>
        <h1 className="section-title !text-4xl sm:!text-5xl">Eğitmenler</h1>
        <div className="section-rule !w-28" />
        <p className="mt-5 text-muted">
          Planlanan program kapsamında görev alacak eğitmenlerin unvan ve
          özgeçmiş bilgileri. Kadro, görüşmeler tamamlandıkça güncellenecektir.
          Detay için eğitmen kartına tıklayınız.
        </p>
      </header>

      <InstructorGrid instructors={instructors} />
    </main>
  );
}
