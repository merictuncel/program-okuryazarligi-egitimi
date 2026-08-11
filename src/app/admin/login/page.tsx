"use client";

import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const rateRes = await fetch("/api/auth/rate-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (rateRes.ok) {
        const rate = (await rateRes.json()) as {
          ok: boolean;
          retryAfterSec?: number | null;
        };
        if (!rate.ok) {
          const mins = Math.max(1, Math.ceil((rate.retryAfterSec ?? 900) / 60));
          toast.error(
            `Çok fazla başarısız deneme. Yaklaşık ${mins} dakika sonra tekrar deneyin.`,
          );
          return;
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        const rateLimited =
          result.error === "RATE_LIMIT" ||
          result.error.toLowerCase().includes("rate_limit");
        toast.error(
          rateLimited
            ? "Çok fazla başarısız deneme. Lütfen 15 dakika sonra tekrar deneyin."
            : "E-posta veya şifre hatalı.",
        );
        return;
      }

      toast.success("Giriş başarılı.");
      router.push("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-4 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200"
      >
        <div>
          <p className="text-xs tracking-[0.18em] text-slate-400 uppercase">
            Yönetim Paneli
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">
            Admin Girişi
          </h1>
        </div>

        <label className="block space-y-1 text-sm">
          <span className="font-medium text-slate-700">E-posta</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          />
        </label>

        <label className="block space-y-1 text-sm">
          <span className="font-medium text-slate-700">Şifre</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>
    </main>
  );
}
