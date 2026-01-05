// app/(auth)/layout.tsx
import { BookOpen } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Colonne gauche - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-12 flex-col justify-between">
        <Link href="/" className="flex items-center space-x-3 text-white">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold">GSJP</h1>
            <p className="text-sm text-blue-100">Global South Journal</p>
          </div>
        </Link>

        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Advancing child health research in the Global South
          </h2>
          <p className="text-blue-100 text-lg">
            Join our community of researchers, reviewers, and editors dedicated
            to publishing high-quality pediatric research.
          </p>
          
          <div className="grid grid-cols-2 gap-4 pt-8">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-3xl font-bold text-white">Open Access</p>
              <p className="text-blue-100 text-sm mt-1">Free for all</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-3xl font-bold text-white">Peer Review</p>
              <p className="text-blue-100 text-sm mt-1">Double-blind</p>
            </div>
          </div>
        </div>

        <p className="text-blue-100 text-sm">
          © 2024 Global South Journal of Pediatrics. All rights reserved.
        </p>
      </div>

      {/* Colonne droite - Formulaire */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <Link href="/" className="lg:hidden flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">GSJP</span>
          </Link>

          {children}
        </div>
      </div>
    </div>
  );
}