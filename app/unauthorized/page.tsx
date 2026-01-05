// app/unauthorized/page.tsx
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-10 h-10 text-red-600" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600">
            You don't have permission to access this page. This area is restricted to specific user roles.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button variant="outline">
              Go to Homepage
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button>
              Go to Dashboard
            </Button>
          </Link>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need access? Contact us at{" "}
            <a href="mailto:support@gsjpediatrics.org" className="text-blue-600 hover:underline">
              support@gsjpediatrics.org
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}