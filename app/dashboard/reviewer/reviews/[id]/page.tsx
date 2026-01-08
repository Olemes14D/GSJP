import { requireRole } from "@/lib/auth-utils";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { ReviewForm } from "@/components/review/ReviewForm";

export default async function ReviewPage({ params }: { params: { id: string } }) {
  const session = await requireRole([Role.REVIEWER, Role.EDITOR, Role.ADMIN]);

  const review = await prisma.review.findUnique({
    where: { id: params.id },
    include: {
      submission: {
        select: {
          title: true,
          abstract: true,
          keywords: true,
          manuscriptFileUrl: true,
        },
      },
    },
  });

  if (!review || review.reviewerId !== session.user.id) {
    notFound();
  }

  // Si déjà complété, rediriger
  if (review.status === "COMPLETED") {
    redirect("/dashboard/reviewer?message=review-already-completed");
  }

  // Si juste invité, proposer d'accepter/décliner
  const handleResponse = async (accept: boolean) => {
    "use server";
    await prisma.review.update({
      where: { id: params.id },
      data: { 
        status: accept ? "ACCEPTED" : "DECLINED",
        acceptedAt: accept ? new Date() : null,
      },
    });
  };

  if (review.status === "INVITED") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Review Invitation</h1>
        
        <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {review.submission.title}
            </h2>
            <p className="text-gray-600">{review.submission.abstract}</p>
          </div>

          {review.dueDate && (
            <p className="text-sm text-gray-600">
              Expected completion date: {new Date(review.dueDate).toLocaleDateString()}
            </p>
          )}

          <div className="flex space-x-4">
            <form action={async () => {
              "use server";
              await handleResponse(true);
              redirect(`/dashboard/reviewer/reviews/${params.id}`);
            }}>
              <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">
                Accept Invitation
              </button>
            </form>

            <form action={async () => {
              "use server";
              await handleResponse(false);
              redirect("/dashboard/reviewer");
            }}>
              <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50">
                Decline
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/dashboard/reviewer" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Reviews
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Review</h1>
        <p className="text-gray-600">Complete your peer review for this manuscript</p>
      </div>

      {/* Manuscript Details */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Manuscript Details</h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-700">Title</p>
            <p className="text-gray-900">{review.submission.title}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Abstract</p>
            <p className="text-gray-700 text-sm">{review.submission.abstract}</p>
          </div>
          {review.submission.manuscriptFileUrl && (
            <a
              href="#"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">Download Manuscript</span>
            </a>
          )}
        </div>
      </div>

      <ReviewForm reviewId={review.id} submissionTitle={review.submission.title} />
    </div>
  );
}