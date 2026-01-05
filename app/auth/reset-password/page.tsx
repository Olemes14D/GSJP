// app/(auth)/reset-password/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // TODO: Implémenter l'API de reset password
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
            <p className="text-gray-600">
              We've sent password reset instructions to <strong>{email}</strong>
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-600 text-center">
            Didn't receive the email? Check your spam folder or try again.
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setSuccess(false)}
          >
            Try another email
          </Button>
          <Link href="/login" className="block">
            <Button variant="link" className="w-full">
              Back to sign in
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/login"
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to sign in
      </Link>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Reset password</h1>
        <p className="text-gray-600">
          Enter your email and we'll send you instructions to reset your password
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send reset instructions"
          )}
        </Button>
      </form>

      <div className="text-center text-sm text-gray-600">
        Remember your password?{" "}
        <Link
          href="/login"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}