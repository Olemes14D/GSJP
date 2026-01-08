// components/layout/ClientLayout.tsx
"use client";

import { Header } from "@/components/layout/Header";
import { useEffect, useState } from "react";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted && <Header />}
      <main className="min-h-screen pt-16 bg-gray-50">
        {children}
      </main>
    </>
  );
}