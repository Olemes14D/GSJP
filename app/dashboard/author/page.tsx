// app/dashboard/author/page.tsx - DASHBOARD AUTHOR AMÉLIORÉ
import { requireRole } from "@/lib/auth-utils";
import { Role, SubmissionStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FileText, Clock, CheckCircle, AlertCircle, TrendingUp, Eye } from "lucide-react";

export default async function AuthorDashboardPage() {
  const session = await requireRole([Role.AUTHOR, Role.ADMIN]);

  // Récupérer les soumissions de l'auteur
  const submissions = await prisma.submission.findMany({
    where: { authorId: session.user.id },
    orderBy: { submittedAt: "desc" },
    take: 5,
  });

  // Calculer les statistiques
  const stats = {
    total: await prisma.submission.count({
      where: { authorId: session.user.id },
    }),
    underReview: await prisma.submission.count({
      where: { 
        authorId: session.user.id,
        status: { in: ["SUBMITTED", "UNDER_REVIEW"] },
      },
    }),
    published: await prisma.submission.count({
      where: { 
        authorId: session.user.id,
        status: "PUBLISHED",
      },
    }),
    needsRevision: await prisma.submission.count({
      where: { 
        authorId: session.user.id,
        status: "REVISIONS_REQUESTED",
      },
    }),
  };

  const getStatusBadge = (status: SubmissionStatus) => {
    const badges: Record<SubmissionStatus, { bg: string; text: string; label: string }> = {
      SUBMITTED: { bg: "bg-blue-100", text: "text-blue-800", label: "Submitted" },
      UNDER_REVIEW: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Under Review" },
      REVISIONS_REQUESTED: { bg: "bg-orange-100", text: "text-orange-800", label: "Revisions Requested" },
      REVISED_SUBMITTED: { bg: "bg-purple-100", text: "text-purple-800", label: "Revised" },
      ACCEPTED: { bg: "bg-green-100", text: "text-green-800", label: "Accepted" },
      REJECTED: { bg: "bg-red-100", text: "text-red-800", label: "Rejected" },
      PUBLISHED: { bg: "bg-emerald-100", text: "text-emerald-800", label: "Published" },
      WITHDRAWN: { bg: "bg-gray-100", text: "text-gray-800", label: "Withdrawn" },
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
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {session.user.name}!</h1>
        <p className="text-gray-600 mt-2">Here's an overview of your submissions and activity</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-600">Total Submissions</p>
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
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.published}</p>
          <p className="text-sm text-gray-600">Published</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="w-8 h-8 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.needsRevision}</p>
          <p className="text-sm text-gray-600">Needs Revision</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">Ready to publish your research?</h2>
            <p className="text-blue-100">Submit your manuscript to GSJP and reach a global audience</p>
          </div>
          <Link
            href="/submit"
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
          >
            Submit New Article
          </Link>
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Submissions</h2>
          <Link href="/dashboard/author/submissions" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All →
          </Link>
        </div>

        <div className="divide-y divide-gray-200">
          {submissions.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">No submissions yet</p>
              <Link
                href="/submit"
                className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
              >
                Submit Your First Article
              </Link>
            </div>
          ) : (
            submissions.map((submission) => (
              <div key={submission.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{submission.title}</h3>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <span className="capitalize">{submission.articleType.replace(/_/g, " ")}</span>
                      <span>•</span>
                      <span>{new Date(submission.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {getStatusBadge(submission.status)}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      Last updated: {new Date(submission.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Link
                    href={`/dashboard/author/submissions/${submission.id}`}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Tips & Guidelines */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">📝 Submission Tips</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Ensure your manuscript follows ICMJE guidelines</li>
            <li>• Include all necessary figures and tables</li>
            <li>• Provide complete author information</li>
            <li>• Declare any conflicts of interest</li>
          </ul>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">⚡ What's Next?</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Review process typically takes 4-8 weeks</li>
            <li>• You'll receive email notifications at each stage</li>
            <li>• Check your dashboard regularly for updates</li>
            <li>• Respond promptly to revision requests</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

