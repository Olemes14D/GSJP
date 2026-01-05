// app/page.tsx
import Link from "next/link";
import { ArrowRight, BookOpen, Users, FileText, Globe } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Global South Journal of Pediatrics
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            An open access, peer-reviewed journal dedicated to advancing child and adolescent health in the Global South
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/articles"
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center justify-center"
            >
              Browse Articles
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Globe,
                title: "Open Access",
                description: "All articles freely available worldwide under CC BY license",
                color: "text-blue-600 bg-blue-100"
              },
              {
                icon: Users,
                title: "Double-Blind Peer Review",
                description: "Rigorous scientific evaluation by international experts",
                color: "text-green-600 bg-green-100"
              },
              {
                icon: FileText,
                title: "COPE Compliant",
                description: "Following international publishing ethics standards",
                color: "text-purple-600 bg-purple-100"
              },
              {
                icon: BookOpen,
                title: "DOI & Indexing Ready",
                description: "Preparing for PubMed, Scopus, and DOAJ indexing",
                color: "text-orange-600 bg-orange-100"
              }
            ].map((feature, idx) => (
              <div key={idx} className="text-center p-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.color} rounded-full mb-4`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to publish your research?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our community of researchers dedicated to advancing child health in the Global South
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  );
}