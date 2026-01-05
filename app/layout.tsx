// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: "Global South Journal of Pediatrics",
    template: "%s | GSJP",
  },
  description: "An open access, peer-reviewed journal dedicated to advancing child and adolescent health in the Global South",
  keywords: ["pediatrics", "global south", "open access", "peer review", "child health", "adolescent health"],
  authors: [{ name: "GSJP Editorial Team" }],
  creator: "Global South Journal of Pediatrics",
  publisher: "GSJP",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Global South Journal of Pediatrics",
    description: "An open access, peer-reviewed journal dedicated to advancing child and adolescent health in the Global South",
    siteName: "GSJP",
  },
  twitter: {
    card: "summary_large_image",
    title: "Global South Journal of Pediatrics",
    description: "An open access, peer-reviewed journal dedicated to advancing child and adolescent health in the Global South",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}