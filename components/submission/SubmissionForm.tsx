// components/submission/SubmissionForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  FileText, 
  Upload, 
  Users, 
  Info, 
  CheckCircle, 
  Loader2,
  AlertCircle,
  ChevronRight,
  ChevronLeft
} from "lucide-react";

const ARTICLE_TYPES = [
  { value: "ORIGINAL_RESEARCH", label: "Original Research", description: "4000-6000 words" },
  { value: "SYSTEMATIC_REVIEW", label: "Systematic Review", description: "5000-8000 words" },
  { value: "CASE_REPORT", label: "Case Report", description: "1500-2500 words" },
  { value: "BRIEF_COMMUNICATION", label: "Brief Communication", description: "1000-1500 words" },
  { value: "COMMENTARY", label: "Commentary/Perspective", description: "1000-2000 words" },
];

const STEPS = [
  { id: 1, name: "Article Type", icon: FileText },
  { id: 2, name: "Files", icon: Upload },
  { id: 3, name: "Details", icon: Info },
  { id: 4, name: "Authors", icon: Users },
  { id: 5, name: "Review", icon: CheckCircle },
];

interface Author {
  name: string;
  email: string;
  institution: string;
  orcid?: string;
}

export function SubmissionForm({ authorId }: { authorId: string }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    articleType: "",
    title: "",
    abstract: "",
    keywords: "",
    manuscriptFile: null as File | null,
    manuscriptFileUrl: "",
    figureFiles: [] as File[],
    figuresUrls: [] as string[],
    wordCount: 0,
    correspondingAuthor: {
      name: "",
      email: "",
      institution: "",
      phone: "",
      orcid: "",
    },
    coAuthors: [] as Author[],
    ethicalApproval: "",
    ethicalApprovalNumber: "",
    fundingSource: "",
    fundingInfo: "",
    conflictsOfInterest: "",
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "manuscript" | "figures") => {
    const files = e.target.files;
    if (!files) return;

    if (type === "manuscript") {
      const file = files[0];
      setFormData({ ...formData, manuscriptFile: file });
      // En production, uploader vers un service cloud
      // Pour l'instant, on simule juste l'URL
      setFormData(prev => ({ ...prev, manuscriptFileUrl: `temp-url-${file.name}` }));
    } else {
      const figureFiles = Array.from(files);
      setFormData({ ...formData, figureFiles });
      // Simuler les URLs
      const urls = figureFiles.map(f => `temp-url-${f.name}`);
      setFormData(prev => ({ ...prev, figuresUrls: urls }));
    }
  };

  const addCoAuthor = () => {
    setFormData({
      ...formData,
      coAuthors: [...formData.coAuthors, { name: "", email: "", institution: "", orcid: "" }],
    });
  };

  const updateCoAuthor = (index: number, field: keyof Author, value: string) => {
    const updated = [...formData.coAuthors];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, coAuthors: updated });
  };

  const removeCoAuthor = (index: number) => {
    setFormData({
      ...formData,
      coAuthors: formData.coAuthors.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          abstract: formData.abstract,
          keywords: formData.keywords.split(",").map(k => k.trim()).filter(Boolean),
          articleType: formData.articleType,
          manuscriptFileUrl: formData.manuscriptFileUrl,
          figuresUrls: formData.figuresUrls,
          wordCount: formData.wordCount,
          correspondingAuthor: formData.correspondingAuthor,
          coAuthors: formData.coAuthors,
          ethicalApprovalNumber: formData.ethicalApprovalNumber,
          fundingInfo: formData.fundingInfo,
          conflictsOfInterest: formData.conflictsOfInterest,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Submission failed");
      }

      router.push(`/dashboard/author/submissions?success=true`);
    } catch (error: any) {
      setError(error.message);
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!formData.articleType;
      case 2:
        return !!formData.manuscriptFile;
      case 3:
        return formData.title && formData.abstract && formData.keywords;
      case 4:
        return formData.correspondingAuthor.name && formData.correspondingAuthor.email;
      default:
        return true;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, idx) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <span className="text-xs mt-2 font-medium text-gray-600">{step.name}</span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`flex-1 h-1 mx-2 ${currentStep > step.id ? "bg-blue-600" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Step Content */}
      <div className="min-h-[400px]">
        {/* Step 1: Article Type */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Article Type</h2>
            <div className="grid gap-4">
              {ARTICLE_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setFormData({ ...formData, articleType: type.value })}
                  className={`p-6 border-2 rounded-lg text-left transition-all ${
                    formData.articleType === type.value
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <h3 className="font-semibold text-gray-900 mb-1">{type.label}</h3>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Files Upload */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Files</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manuscript File * (Word or PDF)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <input
                  type="file"
                  accept=".doc,.docx,.pdf"
                  onChange={(e) => handleFileUpload(e, "manuscript")}
                  className="hidden"
                  id="manuscript-upload"
                />
                <label
                  htmlFor="manuscript-upload"
                  className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                >
                  Click to upload manuscript
                </label>
                {formData.manuscriptFile && (
                  <p className="mt-2 text-sm text-green-600">✓ {formData.manuscriptFile.name}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Figures/Images (optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileUpload(e, "figures")}
                  className="hidden"
                  id="figures-upload"
                />
                <label
                  htmlFor="figures-upload"
                  className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                >
                  Upload figures
                </label>
                {formData.figureFiles.length > 0 && (
                  <p className="mt-2 text-sm text-green-600">
                    ✓ {formData.figureFiles.length} file(s) uploaded
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Article Details */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Article Details</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter article title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Abstract *</label>
              <textarea
                value={formData.abstract}
                onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter abstract (250-300 words)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keywords * (comma separated)
              </label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., pediatrics, malnutrition, West Africa"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Word Count (approximate)
              </label>
              <input
                type="number"
                value={formData.wordCount || ""}
                onChange={(e) => setFormData({ ...formData, wordCount: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter word count"
              />
            </div>
          </div>
        )}

        {/* Step 4: Authors */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Authors</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Corresponding Author</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={formData.correspondingAuthor.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    correspondingAuthor: { ...formData.correspondingAuthor, name: e.target.value }
                  })}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={formData.correspondingAuthor.email}
                  onChange={(e) => setFormData({
                    ...formData,
                    correspondingAuthor: { ...formData.correspondingAuthor, email: e.target.value }
                  })}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Institution"
                  value={formData.correspondingAuthor.institution}
                  onChange={(e) => setFormData({
                    ...formData,
                    correspondingAuthor: { ...formData.correspondingAuthor, institution: e.target.value }
                  })}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="ORCID (optional)"
                  value={formData.correspondingAuthor.orcid}
                  onChange={(e) => setFormData({
                    ...formData,
                    correspondingAuthor: { ...formData.correspondingAuthor, orcid: e.target.value }
                  })}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Co-Authors</h3>
                <button
                  onClick={addCoAuthor}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  + Add Co-Author
                </button>
              </div>

              {formData.coAuthors.map((author, idx) => (
                <div key={idx} className="p-4 border border-gray-200 rounded-lg mb-4">
                  <div className="grid md:grid-cols-2 gap-4 mb-2">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={author.name}
                      onChange={(e) => updateCoAuthor(idx, "name", e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={author.email}
                      onChange={(e) => updateCoAuthor(idx, "email", e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Institution"
                      value={author.institution}
                      onChange={(e) => updateCoAuthor(idx, "institution", e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="ORCID"
                      value={author.orcid}
                      onChange={(e) => updateCoAuthor(idx, "orcid", e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <button
                    onClick={() => removeCoAuthor(idx)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Review & Submit */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Review & Submit</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Article Type</h3>
                <p className="text-gray-700">{ARTICLE_TYPES.find(t => t.value === formData.articleType)?.label}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Title</h3>
                <p className="text-gray-700">{formData.title}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Files</h3>
                <p className="text-gray-700">Manuscript: {formData.manuscriptFile?.name}</p>
                {formData.figureFiles.length > 0 && (
                  <p className="text-gray-700">Figures: {formData.figureFiles.length} file(s)</p>
                )}
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Corresponding Author</h3>
                <p className="text-gray-700">{formData.correspondingAuthor.name} ({formData.correspondingAuthor.email})</p>
              </div>

              {formData.coAuthors.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Co-Authors</h3>
                  <p className="text-gray-700">{formData.coAuthors.length} co-author(s)</p>
                </div>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                By submitting, you confirm that this manuscript has not been published elsewhere and is not under consideration by another journal.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="flex items-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </button>

        {currentStep < 5 ? (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={!canProceed()}
            className="flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Article
                <CheckCircle className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}