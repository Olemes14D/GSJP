// app/dashboard/reviewer/page.tsx - DASHBOARD REVIEWER AMÉLIORÉ
import { requireRole } from "@/lib/auth-utils";
import { Role, ReviewStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FileText, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export default async function ReviewerDashboardPage() {
  const session = await requireRole([Role.REVIEWER, Role.EDITOR, Role.ADMIN]);

  // Récupérer les reviews du reviewer
  const reviews = await prisma.review.findMany({
    where: { reviewerId: session.user.id },
    include: {
      submission: {
        select: {
          id: true,
          title: true,
          articleType: true,
          submittedAt: true,
        },
      },
    },
    orderBy: { invitedAt: "desc" },
    take: 5,
  });

  // Statistiques
  const stats = {
    invited: await prisma.review.count({
      where: { reviewerId: session.user.id, status: "INVITED" },
    }),
    inProgress: await prisma.review.count({
      where: { reviewerId: session.user.id, status: { in: ["ACCEPTED", "IN_PROGRESS"] } },
    }),
    completed: await prisma.review.count({
      where: { reviewerId: session.user.id, status: "COMPLETED" },
    }),
    total: await prisma.review.count({
      where: { reviewerId: session.user.id },
    }),
  };

  const getReviewStatusBadge = (status: ReviewStatus) => {
    const badges: Record<ReviewStatus, { bg: string; text: string; label: string }> = {
      INVITED: { bg: "bg-blue-100", text: "text-blue-800", label: "Invited" },
      ACCEPTED: { bg: "bg-green-100", text: "text-green-800", label: "Accepted" },
      DECLINED: { bg: "bg-red-100", text: "text-red-800", label: "Declined" },
      IN_PROGRESS: { bg: "bg-yellow-100", text: "text-yellow-800", label: "In Progress" },
      COMPLETED: { bg: "bg-emerald-100", text: "text-emerald-800", label: "Completed" },
      OVERDUE: { bg: "bg-red-100", text: "text-red-800", label: "Overdue" },
    };
    const badge = badges[status];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reviewer Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your peer review assignments</p>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.invited}</p>
          <p className="text-sm text-gray-600">Pending Invitations</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
          <p className="text-sm text-gray-600">In Progress</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
          <p className="text-sm text-gray-600">Completed</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-8 h-8 text-gray-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-600">Total Reviews</p>
        </div>
      </div>

      {/* Active Reviews */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Active Review Assignments</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {reviews.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No review assignments yet</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{review.submission.title}</h3>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <span className="capitalize">{review.submission.articleType.replace(/_/g, " ")}</span>
                      <span>•</span>
                      <span>Invited {new Date(review.invitedAt).toLocaleDateString()}</span>
                      {review.dueDate && (
                        <>
                          <span>•</span>
                          <span>Due {new Date(review.dueDate).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                  {getReviewStatusBadge(review.status)}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {review.status === "INVITED" && "Please accept or decline this invitation"}
                    {review.status === "ACCEPTED" && "Review in progress"}
                    {review.status === "COMPLETED" && `Completed on ${new Date(review.completedAt!).toLocaleDateString()}`}
                  </div>
                  <Link
                    href={`/dashboard/reviewer/reviews/${review.id}`}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    {review.status === "INVITED" ? "Respond →" : "View Details →"}
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Review Guidelines */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-3">📋 Review Guidelines</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Reviews should be completed within 2-3 weeks of acceptance</li>
          <li>• Provide constructive and respectful feedback</li>
          <li>• Assess scientific rigor, methodology, and relevance</li>
          <li>• Maintain confidentiality throughout the process</li>
        </ul>
      </div>
    </div>
  );
}