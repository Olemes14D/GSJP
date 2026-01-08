// app/dashboard/admin/page.tsx - DASHBOARD ADMIN
import { requireRole } from "@/lib/auth-utils";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, FileText, Shield, Activity, TrendingUp, Database } from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await requireRole([Role.ADMIN]);

  // Statistiques système
  const stats = {
    totalUsers: await prisma.user.count(),
    authors: await prisma.user.count({ where: { role: "AUTHOR" } }),
    reviewers: await prisma.user.count({ where: { role: "REVIEWER" } }),
    editors: await prisma.user.count({ where: { role: "EDITOR" } }),
    totalSubmissions: await prisma.submission.count(),
    thisMonth: await prisma.submission.count({
      where: {
        submittedAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
    published: await prisma.submission.count({ where: { status: "PUBLISHED" } }),
    activeReviews: await prisma.review.count({
      where: { status: { in: ["ACCEPTED", "IN_PROGRESS"] } },
    }),
  };

  // Activités récentes
  const recentActivity = await prisma.activityLog.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { fullName: true, email: true },
      },
      submission: {
        select: { title: true },
      },
    },
  });

  // Utilisateurs récents
  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">System overview and management</p>
      </div>

      {/* System Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-blue-600" />
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
          <p className="text-sm text-gray-600">Total Users</p>
          <div className="mt-2 text-xs text-gray-500">
            {stats.authors} Authors • {stats.reviewers} Reviewers • {stats.editors} Editors
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalSubmissions}</p>
          <p className="text-sm text-gray-600">Total Submissions</p>
          <div className="mt-2 text-xs text-gray-500">
            +{stats.thisMonth} this month
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.published}</p>
          <p className="text-sm text-gray-600">Publications</p>
          <div className="mt-2 text-xs text-gray-500">
            {Math.round((stats.published / stats.totalSubmissions) * 100)}% acceptance rate
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.activeReviews}</p>
          <p className="text-sm text-gray-600">Active Reviews</p>
          <div className="mt-2 text-xs text-gray-500">
            Ongoing peer reviews
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 text-sm">
                  <Activity className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-gray-900">
                      <span className="font-medium">{activity.user.fullName}</span>{" "}
                      <span className="text-gray-600">{activity.action.toLowerCase().replace(/_/g, " ")}</span>
                    </p>
                    {activity.submission && (
                      <p className="text-gray-500 text-xs mt-0.5 truncate">
                        {activity.submission.title}
                      </p>
                    )}
                    <p className="text-gray-400 text-xs mt-0.5">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Registrations</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.fullName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{user.fullName}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      user.role === "AUTHOR" ? "bg-blue-100 text-blue-800" :
                      user.role === "REVIEWER" ? "bg-green-100 text-green-800" :
                      user.role === "EDITOR" ? "bg-purple-100 text-purple-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {user.role}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/admin/users"
          className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <Users className="w-8 h-8 text-blue-600 mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">Manage Users</h3>
          <p className="text-sm text-gray-600">View and manage all user accounts</p>
        </Link>

        <Link
          href="/dashboard/admin/submissions"
          className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <FileText className="w-8 h-8 text-purple-600 mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">All Submissions</h3>
          <p className="text-sm text-gray-600">Browse all manuscript submissions</p>
        </Link>

        <Link
          href="/dashboard/admin/settings"
          className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <Database className="w-8 h-8 text-green-600 mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">System Settings</h3>
          <p className="text-sm text-gray-600">Configure platform settings</p>
        </Link>
      </div>
    </div>
  );
}