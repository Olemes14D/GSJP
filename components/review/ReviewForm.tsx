// components/review/ReviewForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface ReviewFormProps {
  reviewId: string;
  submissionTitle: string;
}

export function ReviewForm({ reviewId, submissionTitle }: ReviewFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    recommendation: "",
    commentsToAuthor: "",
    commentsToEditor: "",
    confidentialComments: "",
    novelty: "",
    methodology: "",
    significance: "",
    clarity: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.recommendation) {
      setError("Please select a recommendation");
      return;
    }

    if (!formData.commentsToAuthor.trim()) {
      setError("Please provide comments for the author");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "COMPLETED",
          recommendation: formData.recommendation,
          commentsToAuthor: formData.commentsToAuthor,
          commentsToEditor: formData.commentsToEditor || null,
          confidentialComments: formData.confidentialComments || null,
          reviewQuality: JSON.stringify({
            novelty: formData.novelty,
            methodology: formData.methodology,
            significance: formData.significance,
            clarity: formData.clarity,
          }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      router.push("/dashboard/reviewer?success=review-submitted");
      router.refresh();
    } catch (error: any) {
      setError(error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-1">Reviewing:</h3>
        <p className="text-gray-700">{submissionTitle}</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Quality Assessment */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Quality Assessment</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { key: "novelty", label: "Novelty/Originality" },
            { key: "methodology", label: "Methodology" },
            { key: "significance", label: "Significance" },
            { key: "clarity", label: "Clarity of Presentation" },
          ].map((item) => (
            <div key={item.key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {item.label}
              </label>
              <select
                value={formData[item.key as keyof typeof formData]}
                onChange={(e) => setFormData({ ...formData, [item.key]: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select rating</option>
                <option value="5">Excellent (5)</option>
                <option value="4">Good (4)</option>
                <option value="3">Fair (3)</option>
                <option value="2">Poor (2)</option>
                <option value="1">Very Poor (1)</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Overall Recommendation */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Overall Recommendation *</h3>
        <div className="space-y-3">
          {[
            { value: "ACCEPT", label: "Accept", color: "green" },
            { value: "MINOR_REVISIONS", label: "Minor Revisions", color: "yellow" },
            { value: "MAJOR_REVISIONS", label: "Major Revisions", color: "orange" },
            { value: "REJECT", label: "Reject", color: "red" },
          ].map((option) => (
            <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="recommendation"
                value={option.value}
                checked={formData.recommendation === option.value}
                onChange={(e) => setFormData({ ...formData, recommendation: e.target.value })}
                className="w-4 h-4"
              />
              <span className="text-gray-900">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Comments to Author */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          Comments to Author * (will be shared with author)
        </h3>
        <textarea
          value={formData.commentsToAuthor}
          onChange={(e) => setFormData({ ...formData, commentsToAuthor: e.target.value })}
          rows={8}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Provide detailed, constructive feedback for the author..."
          required
        />
      </div>

      {/* Comments to Editor */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          Comments to Editor (optional, will NOT be shared with author)
        </h3>
        <textarea
          value={formData.commentsToEditor}
          onChange={(e) => setFormData({ ...formData, commentsToEditor: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Any additional comments for the editor..."
        />
      </div>

      {/* Confidential Comments */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          Confidential Comments (optional, for editor only)
        </h3>
        <textarea
          value={formData.confidentialComments}
          onChange={(e) => setFormData({ ...formData, confidentialComments: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Confidential comments that will not be shared with author or other reviewers..."
        />
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          By submitting this review, you confirm that it is your original work.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Review"
          )}
        </button>
      </div>
    </form>
  );
}