"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="tr">
      <body className="flex min-h-screen flex-col items-center justify-center bg-[#f4f7fa] px-4 text-center text-[#1a2b3c]">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#1a4a7a] uppercase">
          Hata
        </p>
        <h1 className="mt-3 text-3xl font-bold">Bir sorun oluştu</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-[#5c6d7e]">
          Uygulama yüklenirken kritik bir hata oluştu. Lütfen tekrar deneyin.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 rounded-xl bg-[#0a2540] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Tekrar dene
        </button>
      </body>
    </html>
  );
}
