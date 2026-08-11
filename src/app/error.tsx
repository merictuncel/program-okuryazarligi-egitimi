"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
        Hata
      </p>
      <h1 className="mt-3 font-serif text-3xl font-bold text-navy sm:text-4xl">
        Bir sorun oluştu
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-base">
        Sayfa yüklenirken beklenmeyen bir hata meydana geldi. Lütfen tekrar
        deneyin.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="btn btn-primary">
          Tekrar dene
        </button>
        <Link href="/" className="btn btn-ghost !border-line !text-navy">
          Ana Sayfa
        </Link>
      </div>
    </main>
  );
}
