// app/dashboard/page.tsx (Redirection automatique selon rôle)
import { redirect } from "next/navigation";
import { requireAuth, getRoleDashboard } from "@/lib/auth-utils";

export default async function DashboardPage() {
  const session = await requireAuth();
  const dashboard = getRoleDashboard(session.user.role);
  redirect(dashboard);
}
