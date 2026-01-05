// Exemple d'utilisation dans un composant
// components/dashboard/ProtectedComponent.tsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import { Role } from "@prisma/client";
import { Loader2 } from "lucide-react";

export function ProtectedComponent() {
  const { session, isLoading } = useAuth([Role.AUTHOR, Role.ADMIN]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome, {session?.user.name}!</h1>
      <p>Role: {session?.user.role}</p>
    </div>
  );
}