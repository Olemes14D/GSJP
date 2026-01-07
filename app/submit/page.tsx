// app/submit/page.tsx
import { requireRole } from "@/lib/auth-utils";
import { Role } from "@prisma/client";
import { SubmissionForm } from "@/components/submission/SubmissionForm";

export default async function SubmitPage() {
  const session = await requireRole([Role.AUTHOR, Role.ADMIN]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Submit New Article</h1>
          <p className="text-gray-600 mt-2">
            Complete all steps to submit your manuscript to GSJP
          </p>
        </div>

        <SubmissionForm authorId={session.user.id} />
      </div>
    </div>
  );
}