import { requireRole } from "@/lib/auth-utils";
import { Role } from "@prisma/client";

export default async function AuthorDashboardPage() {
  const session = await requireRole([Role.AUTHOR, Role.ADMIN]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Author Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome back, {session.user.name}!</p>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-sm text-gray-500">Total Submissions</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-sm text-gray-500">Under Review</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-sm text-gray-500">Published</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">0</p>
        </div>
      </div>
    </div>
  );
}