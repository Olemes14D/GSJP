import { redirect } from "next/navigation";
import { requireAuth, getRoleDashboard } from "@/lib/auth-utils";

export default async function DashboardPage() {
  const session = await requireAuth();
  redirect(getRoleDashboard(session.user.role));
}