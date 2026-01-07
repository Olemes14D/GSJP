// components/layout/ClientLayout.tsx
"use client";

import { Header } from "@/components/layout/Header";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-16 bg-gray-50">
        {children}
      </main>
    </>
  );
}