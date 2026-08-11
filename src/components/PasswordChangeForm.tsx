"use client";

import { changePasswordAction } from "@/app/admin/actions";
import { ActionForm } from "@/components/ActionForm";

export function PasswordChangeForm() {
  return (
    <section className="mt-10 max-w-3xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-lg font-semibold text-slate-900">Şifre Değiştir</h2>
      <p className="mt-1 text-sm text-slate-500">
        Yönetim paneli giriş şifrenizi güncelleyin.
      </p>
      <ActionForm
        action={changePasswordAction}
        submitLabel="Şifreyi Güncelle"
        className="mt-4 space-y-3"
      >
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-slate-700">Mevcut şifre</span>
          <input
            type="password"
            name="currentPassword"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-slate-700">Yeni şifre</span>
          <input
            type="password"
            name="newPassword"
            required
            minLength={8}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-slate-700">Yeni şifre (tekrar)</span>
          <input
            type="password"
            name="confirmPassword"
            required
            minLength={8}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
      </ActionForm>
    </section>
  );
}
