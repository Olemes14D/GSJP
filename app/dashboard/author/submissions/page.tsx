// app/dashboard/author/submissions/page.tsx
import { requireRole } from "@/lib/auth-utils";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FileText, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default async function SubmissionsPage() {
  const session = await requireRole([Role.AUTHOR, Role.ADMIN]);

  const submissions = await prisma.submission.findMany({
    where: {
      authorId: session.user.id,
    },
    orderBy: {
      submittedAt: "desc",
    },
  });

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; icon: any; label: string }> = {
      SUBMITTED: { color: "bg-blue-100 text-blue-800", icon: Clock, label: "Submitted" },
      UNDER_REVIEW: { color: "bg-yellow-100 text-yellow-800", icon: AlertCircle, label: "Under Review" },
      REVISIONS_REQUESTED: { color: "bg-orange-100 text-orange-800", icon: AlertCircle, label: "Revisions Requested" },
      ACCEPTED: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Accepted" },
      REJECTED: { color: "bg-red-100 text-red-800", icon: XCircle, label: "Rejected" },
      PUBLISHED: { color: "bg-purple-100 text-purple-800", icon: CheckCircle, label: "Published" },
    };

    const badge = badges[status] || badges.SUBMITTED;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {badge.label}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Submissions</h1>
          <p className="text-gray-600 mt-2">Track the status of your submitted manuscripts</p>
        </div>
        <Link
          href="/submit"
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
        >
          Submit New Article
        </Link>
      </div>

      {submissions.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No submissions yet</h3>
          <p className="text-gray-600 mb-6">Start by submitting your first article</p>
          <Link
            href="/submit"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
          >
            Submit Article
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {submission.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="capitalize">{submission.articleType.replace(/_/g, " ")}</span>
                    <span>•</span>
                    <span>Submitted {new Date(submission.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                {getStatusBadge(submission.status)}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Last updated: {new Date(submission.updatedAt).toLocaleDateString()}
                </div>
                <Link
                  href={`/dashboard/author/submissions/${submission.id}`}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}