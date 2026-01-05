// app/(auth)/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, User, GraduationCap } from "lucide-react";
import { Role } from "@prisma/client";

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Angola", "Argentina", "Bangladesh",
  "Benin", "Bolivia", "Brazil", "Burkina Faso", "Burundi", "Cambodia",
  "Cameroon", "Chad", "Chile", "China", "Colombia", "Congo", "Côte d'Ivoire",
  "Dominican Republic", "Egypt", "Ethiopia", "Ghana", "Guatemala", "Guinea",
  "Haiti", "Honduras", "India", "Indonesia", "Iran", "Iraq", "Jordan",
  "Kenya", "Liberia", "Madagascar", "Malawi", "Mali", "Mexico", "Morocco",
  "Mozambique", "Myanmar", "Nepal", "Nicaragua", "Niger", "Nigeria",
  "Pakistan", "Peru", "Philippines", "Rwanda", "Senegal", "Sierra Leone",
  "Somalia", "South Africa", "Sudan", "Syria", "Tanzania", "Thailand",
  "Togo", "Tunisia", "Uganda", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const SPECIALTIES = [
  "Pediatric Infectious Diseases",
  "Neonatology",
  "Pediatric Cardiology",
  "Pediatric Nutrition",
  "Pediatric Gastroenterology",
  "Pediatric Pulmonology",
  "Pediatric Neurology",
  "Pediatric Oncology",
  "Pediatric Endocrinology",
  "Pediatric Nephrology",
  "Child Health Policy",
  "Community Pediatrics",
  "Adolescent Medicine",
  "Tropical Pediatrics",
  "Global Child Health",
  "Other"
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
    role: "" as Role | "",
    institution: "",
    country: "",
    orcid: "",
    specialties: [] as string[],
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

  const handleRoleSelect = (role: Role) => {
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
          specialties: formData.specialties.length > 0 ? formData.specialties : undefined,
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

  const toggleSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
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
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Create account</h1>
        <p className="text-gray-600">
          Join GSJP to submit or review articles
        </p>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center space-x-2">
        <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
        <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Step 1: Choose Role */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <Label className="text-base font-semibold">Select your role</Label>
            <p className="text-sm text-gray-600 mt-1">
              Choose how you want to contribute to GSJP
            </p>
          </div>

          <div className="grid gap-4">
            <button
              onClick={() => handleRoleSelect(Role.AUTHOR)}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all text-left group"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <User className="w-6 h-6 text-blue-600 group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Author</h3>
                  <p className="text-sm text-gray-600">
                    Submit research articles for publication. Perfect for researchers and clinicians.
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect(Role.REVIEWER)}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all text-left group"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors">
                  <GraduationCap className="w-6 h-6 text-green-600 group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Reviewer</h3>
                  <p className="text-sm text-gray-600">
                    Evaluate submitted manuscripts as a peer reviewer. Requires expertise in pediatrics.
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
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name *</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Dr. Jane Doe"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={(e) => handlePasswordChange(e.target.value)}
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

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password *</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          {/* Institution */}
          <div className="space-y-2">
            <Label htmlFor="institution">Institution</Label>
            <Input
              id="institution"
              type="text"
              placeholder="University or Hospital name"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              disabled={isLoading}
            />
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="country">Country *</Label>
            <select
              id="country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            >
              <option value="">Select your country</option>
              {COUNTRIES.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          {/* ORCID */}
          <div className="space-y-2">
            <Label htmlFor="orcid">ORCID iD (optional)</Label>
            <Input
              id="orcid"
              type="text"
              placeholder="0000-0000-0000-0000"
              value={formData.orcid}
              onChange={(e) => setFormData({ ...formData, orcid: e.target.value })}
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500">
              Don't have an ORCID?{" "}
              <a href="https://orcid.org/register" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Register here
              </a>
            </p>
          </div>

          {/* Specialties (for Reviewers) */}
          {formData.role === Role.REVIEWER && (
            <div className="space-y-2">
              <Label>Areas of expertise (select all that apply)</Label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                {SPECIALTIES.map(specialty => (
                  <label key={specialty} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.specialties.includes(specialty)}
                      onChange={() => toggleSpecialty(specialty)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                    <span>{specialty}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              disabled={isLoading}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !isPasswordValid()}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </form>
      )}
    </div>
  );
}