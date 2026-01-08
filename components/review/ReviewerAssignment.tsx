// components/review/ReviewerAssignment.tsx
"use client";

import { useState, useEffect } from "react";
import { Loader2, UserPlus } from "lucide-react";

interface Reviewer {
  id: string;
  fullName: string;
  email: string;
  specialties: string | null;
}

export function ReviewerAssignment({ submissionId }: { submissionId: string }) {
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const [selectedReviewers, setSelectedReviewers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchReviewers();
  }, []);

  const fetchReviewers = async () => {
    try {
      const response = await fetch("/api/reviewers");
      const data = await response.json();
      setReviewers(data.reviewers || []);
    } catch (error) {
      console.error("Error fetching reviewers:", error);
    }
  };

  const handleAssign = async () => {
    if (selectedReviewers.length === 0) {
      setMessage("Please select at least one reviewer");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId,
          reviewerIds: selectedReviewers,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to assign reviewers");
      }

      setMessage(`Successfully assigned ${selectedReviewers.length} reviewer(s)`);
      setSelectedReviewers([]);
      setTimeout(() => window.location.reload(), 2000);
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleReviewer = (reviewerId: string) => {
    setSelectedReviewers(prev =>
      prev.includes(reviewerId)
        ? prev.filter(id => id !== reviewerId)
        : [...prev, reviewerId]
    );
  };

  return (
    <div className="space-y-4">
      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          message.includes("Success") 
            ? "bg-green-50 text-green-800" 
            : "bg-red-50 text-red-800"
        }`}>
          {message}
        </div>
      )}

      <div className="max-h-64 overflow-y-auto space-y-2">
        {reviewers.map((reviewer) => (
          <label
            key={reviewer.id}
            className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedReviewers.includes(reviewer.id)}
              onChange={() => toggleReviewer(reviewer.id)}
              className="mt-1"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-sm">{reviewer.fullName}</p>
              <p className="text-xs text-gray-600">{reviewer.email}</p>
              {reviewer.specialties && (
                <p className="text-xs text-gray-500 mt-1">
                  {JSON.parse(reviewer.specialties).slice(0, 2).join(", ")}
                </p>
              )}
            </div>
          </label>
        ))}
      </div>

      <button
        onClick={handleAssign}
        disabled={isLoading || selectedReviewers.length === 0}
        className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Assigning...
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4 mr-2" />
            Assign {selectedReviewers.length} Reviewer(s)
          </>
        )}
      </button>
    </div>
  );
}
