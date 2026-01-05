// components/providers/Providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { Header } from "@/components/layout/Header";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Header />
      <main className="min-h-screen pt-16 bg-gray-50">
        {children}
      </main>
    </SessionProvider>
  );
}