import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
        404
      </p>
      <h1 className="mt-3 font-serif text-3xl font-bold text-navy sm:text-4xl">
        Sayfa bulunamadı
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-base">
        Aradığınız sayfa taşınmış veya kaldırılmış olabilir. Ana sayfadan
        devam edebilirsiniz.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">
          Ana Sayfa
        </Link>
        <Link href="/duyurular" className="btn btn-ghost !text-navy !border-line">
          Duyurular
        </Link>
      </div>
    </main>
  );
}
