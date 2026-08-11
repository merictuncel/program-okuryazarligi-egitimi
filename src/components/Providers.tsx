"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            fontSize: "14px",
            borderRadius: "10px",
          },
        }}
      />
    </SessionProvider>
  );
}
