// lib/auth-utils.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export async function requireRole(allowedRoles: Role[]) {
  const session = await requireAuth();
  
  if (!allowedRoles.includes(session.user.role)) {
    redirect("/unauthorized");
  }
  
  return session;
}

export function getRoleDashboard(role: Role): string {
  const dashboards: Record<Role, string> = {
    AUTHOR: "/dashboard/author",
    REVIEWER: "/dashboard/reviewer",
    EDITOR: "/dashboard/editor",
    ADMIN: "/dashboard/admin",
  };
  
  return dashboards[role] || "/";
}