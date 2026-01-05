// app/(auth)/register/page.tsx - VERSION SANS SHADCN
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle2, User, GraduationCap } from "lucide-react";

const COUNTRIES = [
  "Benin", "Burkina Faso", "Cameroon", "Chad", "Ghana", "Kenya", "Nigeria",
  "Senegal", "South Africa", "Tanzania", "Uganda", "Other"
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    role: "",
    institution: "",
    country: "",
    orcid: "",
  });

  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
  });

  const handlePasswordChange = (password: string) => {
    setFormData({ ...formData, password });
    setPasswordStrength({
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
    });
  };

  const isPasswordValid = () => {
    return Object.values(passwordStrength).every(Boolean);
  };

  const handleRoleSelect = (role: string) => {
    setFormData({ ...formData, role });
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!isPasswordValid()) {
      setError("Password does not meet requirements");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          role: formData.role,
          institution: formData.institution,
          country: formData.country,
          orcid: formData.orcid || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login?registered=true");
      }, 2000);
    } catch (error: any) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Account created!</h2>
        <p className="text-gray-600">
          Your account has been successfully created. Redirecting to login...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Create account</h1>
        <p className="text-gray-600">Join GSJP to submit or review articles</p>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center space-x-2">
        <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
        <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Step 1: Choose Role */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold">Select your role</h3>
            <p className="text-sm text-gray-600 mt-1">
              Choose how you want to contribute to GSJP
            </p>
          </div>

          <div className="grid gap-4">
            <button
              onClick={() => handleRoleSelect("AUTHOR")}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all text-left group"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <User className="w-6 h-6 text-blue-600 group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Author</h3>
                  <p className="text-sm text-gray-600">
                    Submit research articles for publication
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect("REVIEWER")}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all text-left group"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors">
                  <GraduationCap className="w-6 h-6 text-green-600 group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Reviewer</h3>
                  <p className="text-sm text-gray-600">
                    Evaluate submitted manuscripts as a peer reviewer
                  </p>
                </div>
              </div>
            </button>
          </div>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
            </Link>
          </div>
        </div>
      )}

      {/* Step 2: Registration Form */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address *
            </label>
            <input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full name *
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="Dr. Jane Doe"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password *
            </label>
            <input
              id="password"
              type="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
              disabled={isLoading}
            />
            <div className="space-y-1 text-xs">
              <div className={passwordStrength.hasMinLength ? "text-green-600" : "text-gray-500"}>
                {passwordStrength.hasMinLength ? "✓" : "○"} At least 8 characters
              </div>
              <div className={passwordStrength.hasUpperCase ? "text-green-600" : "text-gray-500"}>
                {passwordStrength.hasUpperCase ? "✓" : "○"} One uppercase letter
              </div>
              <div className={passwordStrength.hasLowerCase ? "text-green-600" : "text-gray-500"}>
                {passwordStrength.hasLowerCase ? "✓" : "○"} One lowercase letter
              </div>
              <div className={passwordStrength.hasNumber ? "text-green-600" : "text-gray-500"}>
                {passwordStrength.hasNumber ? "✓" : "○"} One number
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm password *
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
              Institution
            </label>
            <input
              id="institution"
              type="text"
              placeholder="University or Hospital name"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country *
            </label>
            <select
              id="country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
              disabled={isLoading}
            >
              <option value="">Select your country</option>
              {COUNTRIES.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="orcid" className="block text-sm font-medium text-gray-700">
              ORCID iD (optional)
            </label>
            <input
              id="orcid"
              type="text"
              placeholder="0000-0000-0000-0000"
              value={formData.orcid}
              onChange={(e) => setFormData({ ...formData, orcid: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              disabled={isLoading}
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              disabled={isLoading}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading || !isPasswordValid()}
              className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}