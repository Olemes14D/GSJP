// app/dashboard/editor/page.tsx - DASHBOARD ÉDITEUR
import { requireRole } from "@/lib/auth-utils";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FileText, Users, CheckCircle, AlertTriangle, Clock, TrendingUp } from "lucide-react";

export default async function EditorDashboardPage() {
  const session = await requireRole([Role.EDITOR, Role.ADMIN]);

  // Statistiques éditoriales
  const stats = {
    newSubmissions: await prisma.submission.count({
      where: { status: "SUBMITTED" },
    }),
    underReview: await prisma.submission.count({
      where: { status: { in: ["UNDER_REVIEW", "REVISED_SUBMITTED"] } },
    }),
    needsDecision: await prisma.submission.count({
      where: { 
        status: "UNDER_REVIEW",
        reviews: {
          every: { status: "COMPLETED" },
        },
      },
    }),
    published: await prisma.submission.count({
      where: { status: "PUBLISHED" },
    }),
    totalReviewers: await prisma.user.count({
      where: { role: "REVIEWER" },
    }),
    activeReviews: await prisma.review.count({
      where: { status: { in: ["ACCEPTED", "IN_PROGRESS"] } },
    }),
  };

  // Soumissions récentes nécessitant une action
  const pendingSubmissions = await prisma.submission.findMany({
    where: {
      status: { in: ["SUBMITTED", "UNDER_REVIEW"] },
    },
    include: {
      author: {
        select: { fullName: true, email: true },
      },
      _count: {
        select: { reviews: true },
      },
    },
    orderBy: { submittedAt: "desc" },
    take: 5,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Editorial Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage submissions and editorial workflow</p>
      </div>

      {/* Statistics Grid */}
      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.newSubmissions}</p>
          <p className="text-sm text-gray-600">New Submissions</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.underReview}</p>
          <p className="text-sm text-gray-600">Under Review</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.needsDecision}</p>
          <p className="text-sm text-gray-600">Needs Decision</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.published}</p>
          <p className="text-sm text-gray-600">Published</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalReviewers}</p>
          <p className="text-sm text-gray-600">Reviewers</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.activeReviews}</p>
          <p className="text-sm text-gray-600">Active Reviews</p>
        </div>
      </div>

      {/* Action Required */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Action Required</h3>
            <p className="text-sm text-gray-700">
              {stats.needsDecision} submission(s) have completed reviews and are waiting for your editorial decision.
            </p>
          </div>
        </div>
      </div>

      {/* Submissions Requiring Attention */}
      <div className="bg-white rounded-lg border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Submissions Requiring Attention</h2>
          <Link href="/dashboard/editor/submissions" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All →
          </Link>
        </div>

        <div className="divide-y divide-gray-200">
          {pendingSubmissions.length === 0 ? (
            <div className="p-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-600">All caught up! No submissions need attention right now.</p>
            </div>
          ) : (
            pendingSubmissions.map((submission) => (
              <div key={submission.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{submission.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        submission.status === "SUBMITTED" 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {submission.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>By {submission.author.fullName}</span>
                      <span>•</span>
                      <span className="capitalize">{submission.articleType.replace(/_/g, " ")}</span>
                      <span>•</span>
                      <span>{new Date(submission.submittedAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{submission._count.reviews} review(s)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    {submission.status === "SUBMITTED" && (
                      <span className="text-orange-600 font-medium">⚠ Assign reviewers</span>
                    )}
                    {submission.status === "UNDER_REVIEW" && (
                      <span className="text-blue-600 font-medium">📝 Review in progress</span>
                    )}
                  </div>
                  <Link
                    href={`/dashboard/editor/submissions/${submission.id}`}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Manage →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">⚡ Quick Actions</h3>
          <div className="space-y-3">
            <Link
              href="/dashboard/editor/submissions?status=SUBMITTED"
              className="block px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-medium text-sm"
            >
              Review New Submissions
            </Link>
            <Link
              href="/dashboard/editor/reviewers"
              className="block px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 font-medium text-sm"
            >
              Manage Reviewers
            </Link>
            <Link
              href="/dashboard/editor/reports"
              className="block px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 font-medium text-sm"
            >
              View Reports
            </Link>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">📊 Editorial Performance</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-700">Average Review Time:</span>
              <span className="font-semibold text-gray-900">3.5 weeks</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Acceptance Rate:</span>
              <span className="font-semibold text-gray-900">42%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">This Month:</span>
              <span className="font-semibold text-gray-900">{stats.newSubmissions} submissions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
