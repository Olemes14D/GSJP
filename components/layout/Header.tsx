// components/layout/Header.tsx
"use client";

import { BookOpen, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { UserMenu } from "@/components/auth/UserMenu";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "For Authors", href: "/for-authors" },
  { name: "Editorial Board", href: "/editorial-board" },
  { name: "Current Issue", href: "/articles" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 w-full bg-white border-b border-gray-200 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">GSJP</h1>
              <p className="text-xs text-gray-600">Global South Journal</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Menu & Submit Button */}
          <div className="hidden md:flex items-center space-x-4">
            {session && (
              <Link
                href="/submit"
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Submit Article
              </Link>
            )}
            <UserMenu />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-sm font-medium text-gray-700 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-200">
              <UserMenu />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}