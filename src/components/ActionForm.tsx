"use client";

import { useEffect, useRef, useActionState } from "react";
import { useFormStatus } from "react-dom";
import toast from "react-hot-toast";
import type { ActionResult } from "@/app/admin/actions";

const initialState: ActionResult = {
  success: false,
  message: "",
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
    >
      {pending ? "Kaydediliyor..." : label}
    </button>
  );
}

export function ActionForm({
  action,
  children,
  submitLabel,
  className,
  onSuccess,
}: {
  action: (
    prev: ActionResult | null,
    formData: FormData,
  ) => Promise<ActionResult>;
  children: React.ReactNode;
  submitLabel: string;
  className?: string;
  onSuccess?: () => void;
}) {
  const [state, formAction] = useActionState(action, initialState);
  const lastMessage = useRef("");

  useEffect(() => {
    if (!state?.message || state.message === lastMessage.current) return;
    lastMessage.current = state.message;

    if (state.success) {
      toast.success(state.message);
      onSuccess?.();
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state, onSuccess]);

  return (
    <form action={formAction} className={className}>
      {children}
      {state?.errors ? (
        <ul className="space-y-1 text-sm text-red-600">
          {Object.entries(state.errors).map(([field, messages]) =>
            messages?.map((msg) => (
              <li key={`${field}-${msg}`}>
                {field}: {msg}
              </li>
            )),
          )}
        </ul>
      ) : null}
      <SubmitButton label={submitLabel} />
    </form>
  );
}
