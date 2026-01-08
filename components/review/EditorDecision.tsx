// components/review/EditorDecision.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle } from "lucide-react";

export function EditorDecision({ submissionId }: { submissionId: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [decision, setDecision] = useState("");
  const [comments, setComments] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!decision) {
      setError("Please select a decision");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/submissions/${submissionId}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision,
          comments,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit decision");
      }

      router.push("/dashboard/editor?success=decision-made");
      router.refresh();
    } catch (error: any) {
      setError(error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Editorial Decision
        </label>
        <select
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select decision</option>
          <option value="ACCEPTED">Accept</option>
          <option value="REVISIONS_REQUESTED">Request Revisions</option>
          <option value="REJECTED">Reject</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Comments to Author
        </label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Provide feedback based on the reviews..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Submitting Decision...
          </>
        ) : (
          <>
            <CheckCircle className="w-5 h-5 mr-2" />
            Submit Decision
          </>
        )}
      </button>
    </form>
  );
}