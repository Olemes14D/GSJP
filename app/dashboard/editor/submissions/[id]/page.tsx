// app/dashboard/editor/submissions/[id]/page.tsx
import { requireRole } from "@/lib/auth-utils";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, User, Calendar, AlertCircle } from "lucide-react";
import { ReviewerAssignment } from "@/components/review/ReviewerAssignment";
import { EditorDecision } from "@/components/review/EditorDecision";

export default async function SubmissionDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await requireRole([Role.EDITOR, Role.ADMIN]);

  const submission = await prisma.submission.findUnique({
    where: { id: params.id },
    include: {
      author: {
        select: {
          fullName: true,
          email: true,
          institution: true,
        },
      },
      reviews: {
        include: {
          reviewer: {
            select: {
              fullName: true,
              email: true,
              specialties: true,
            },
          },
        },
        orderBy: { invitedAt: "desc" },
      },
    },
  });

  if (!submission) {
    notFound();
  }

  const allReviewsCompleted = submission.reviews.length > 0 && 
    submission.reviews.every(r => r.status === "COMPLETED");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/editor"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{submission.title}</h1>
        <div className="flex items-center space-x-4 mt-4 text-sm text-gray-600">
          <span className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            {submission.author.fullName}
          </span>
          <span>•</span>
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            Submitted {new Date(submission.submittedAt).toLocaleDateString()}
          </span>
          <span>•</span>
          <span className="capitalize">{submission.articleType.replace(/_/g, " ")}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Abstract */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Abstract</h2>
            <p className="text-gray-700 whitespace-pre-line">{submission.abstract}</p>
          </div>

          {/* Keywords */}
          {submission.keywords && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Keywords</h2>
              <div className="flex flex-wrap gap-2">
                {JSON.parse(submission.keywords as string).map((keyword: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Files */}
          {submission.manuscriptFileUrl && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Files</h2>
              <div className="space-y-2">
                <a
                  href="#"
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Manuscript</p>
                    <p className="text-xs text-gray-500">{submission.manuscriptFileUrl}</p>
                  </div>
                </a>
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Reviews ({submission.reviews.length})
            </h2>
            
            {submission.reviews.length === 0 ? (
              <p className="text-gray-600 text-sm">No reviews assigned yet.</p>
            ) : (
              <div className="space-y-4">
                {submission.reviews.map((review) => (
                  <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {review.reviewer.fullName}
                        </p>
                        <p className="text-sm text-gray-600">{review.reviewer.email}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        review.status === "INVITED" ? "bg-blue-100 text-blue-800" :
                        review.status === "ACCEPTED" ? "bg-green-100 text-green-800" :
                        review.status === "DECLINED" ? "bg-red-100 text-red-800" :
                        review.status === "COMPLETED" ? "bg-emerald-100 text-emerald-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {review.status.replace(/_/g, " ")}
                      </span>
                    </div>

                    {review.status === "COMPLETED" && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="mb-3">
                          <span className="text-sm font-medium text-gray-700">Recommendation: </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            review.recommendation === "ACCEPT" ? "bg-green-100 text-green-800" :
                            review.recommendation === "MINOR_REVISIONS" ? "bg-yellow-100 text-yellow-800" :
                            review.recommendation === "MAJOR_REVISIONS" ? "bg-orange-100 text-orange-800" :
                            "bg-red-100 text-red-800"
                          }`}>
                            {review.recommendation?.replace(/_/g, " ")}
                          </span>
                        </div>
                        
                        {review.commentsToAuthor && (
                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-700 mb-1">Comments to Author:</p>
                            <p className="text-sm text-gray-600 whitespace-pre-line">
                              {review.commentsToAuthor}
                            </p>
                          </div>
                        )}

                        {review.confidentialComments && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Confidential Comments (Editor only):
                            </p>
                            <p className="text-sm text-gray-600 whitespace-pre-line">
                              {review.confidentialComments}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Editorial Decision */}
          {allReviewsCompleted && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <div className="flex items-start space-x-3 mb-4">
                <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Action Required</h3>
                  <p className="text-sm text-gray-700">
                    All reviews have been completed. Please make an editorial decision.
                  </p>
                </div>
              </div>
              <EditorDecision submissionId={submission.id} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Status</h3>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              submission.status === "SUBMITTED" ? "bg-blue-100 text-blue-800" :
              submission.status === "UNDER_REVIEW" ? "bg-yellow-100 text-yellow-800" :
              submission.status === "ACCEPTED" ? "bg-green-100 text-green-800" :
              submission.status === "REJECTED" ? "bg-red-100 text-red-800" :
              "bg-gray-100 text-gray-800"
            }`}>
              {submission.status.replace(/_/g, " ")}
            </span>
          </div>

          {/* Author Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Author Information</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Name</p>
                <p className="font-medium text-gray-900">{submission.author.fullName}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{submission.author.email}</p>
              </div>
              {submission.author.institution && (
                <div>
                  <p className="text-gray-600">Institution</p>
                  <p className="font-medium text-gray-900">{submission.author.institution}</p>
                </div>
              )}
            </div>
          </div>

          {/* Assign Reviewers */}
          {submission.status === "SUBMITTED" && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Assign Reviewers</h3>
              <ReviewerAssignment submissionId={submission.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}