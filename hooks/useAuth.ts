// hooks/useAuth.ts (Hook client-side)
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Role } from "@prisma/client";

export function useAuth(requiredRoles?: Role[]) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    if (requiredRoles && !requiredRoles.includes(session.user.role)) {
      router.push("/unauthorized");
    }
  }, [session, status, router, requiredRoles]);

  return { session, status, isLoading: status === "loading" };
}
