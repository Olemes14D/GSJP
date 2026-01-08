// app/articles/[slug]/page.tsx - PAGE ARTICLE PUBLIÉ
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Users, FileText, Download, Eye, Quote, Share2, ExternalLink } from "lucide-react";
import type { Metadata } from "next";

interface ArticlePageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const publication = await prisma.publication.findUnique({
    where: { id: params.slug },
    include: { submission: true },
  });

  if (!publication) {
    return { title: "Article Not Found" };
  }

  return {
    title: `${publication.submission.title} | GSJP`,
    description: publication.submission.abstract.substring(0, 160),
    openGraph: {
      title: publication.submission.title,
      description: publication.submission.abstract,
      type: "article",
      publishedTime: publication.publishedDate.toISOString(),
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const publication = await prisma.publication.findUnique({
    where: { id: params.slug },
    include: {
      submission: {
        include: {
          author: {
            select: {
              fullName: true,
              email: true,
              institution: true,
              orcid: true,
            },
          },
        },
      },
    },
  });

  if (!publication || publication.submission.status !== "PUBLISHED") {
    notFound();
  }

  const { submission } = publication;
  const authors = [submission.author];
  
  // Parser les co-auteurs si présents
  if (submission.coAuthors) {
    const coAuthors = JSON.parse(submission.coAuthors as string);
    authors.push(...coAuthors);
  }

  const keywords = submission.keywords ? JSON.parse(submission.keywords as string) : [];

  // Incrémenter les vues
  await prisma.publication.update({
    where: { id: publication.id },
    data: { viewsCount: { increment: 1 } },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/articles" className="text-sm text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Articles
          </Link>
          
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full mb-4">
              {submission.articleType.replace(/_/g, " ")}
            </span>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{submission.title}</h1>
          </div>

          {/* Authors */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-4">
              {authors.map((author, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <Users className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">{author.fullName || author.name}</p>
                    {author.institution && (
                      <p className="text-sm text-gray-600">{author.institution}</p>
                    )}
                    {author.orcid && (
                      <a
                        href={`https://orcid.org/${author.orcid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline flex items-center"
                      >
                        ORCID: {author.orcid}
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 pb-6 border-b border-gray-200">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Published: {new Date(publication.publishedDate).toLocaleDateString()}
            </span>
            <span>•</span>
            <span className="flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              {publication.viewsCount} views
            </span>
            <span>•</span>
            <span className="flex items-center">
              <Download className="w-4 h-4 mr-2" />
              {publication.downloadsCount} downloads
            </span>
            {publication.volume && publication.issue && (
              <>
                <span>•</span>
                <span>Vol. {publication.volume}, Issue {publication.issue}</span>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mt-6">
            <a
              href={publication.pdfUrl}
              onClick={async () => {
                await fetch(`/api/publications/${publication.id}/download`, { method: "POST" });
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </a>
            <button className="flex items-center px-4 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">
              <Quote className="w-4 h-4 mr-2" />
              Cite
            </button>
            <button className="flex items-center px-4 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          {/* DOI */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Digital Object Identifier (DOI)</p>
            <a
              href={`https://doi.org/${publication.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-mono text-sm flex items-center"
            >
              {publication.doi}
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </div>

          {/* Abstract */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Abstract</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {submission.abstract}
            </p>
          </div>

          {/* Keywords */}
          {keywords.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword: string, idx: number) => (
                  <Link
                    key={idx}
                    href={`/articles?keyword=${encodeURIComponent(keyword)}`}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100"
                  >
                    {keyword}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info */}
          {submission.fundingInfo && (
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Funding</h3>
              <p className="text-gray-700 text-sm">{submission.fundingInfo}</p>
            </div>
          )}

          {submission.conflictsOfInterest && (
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Conflicts of Interest</h3>
              <p className="text-gray-700 text-sm">{submission.conflictsOfInterest}</p>
            </div>
          )}

          {/* License */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Open Access License</h3>
            <p className="text-sm text-gray-700 mb-3">
              This is an open access article distributed under the terms of the{" "}
              <a
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Creative Commons Attribution License (CC BY 4.0)
              </a>
              , which permits unrestricted use, distribution, and reproduction in any medium,
              provided the original author and source are credited.
            </p>
          </div>
        </div>

        {/* Citation Box */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">How to Cite This Article</h3>
          <div className="bg-white border border-gray-300 rounded p-4 font-mono text-sm text-gray-700">
            {authors.map(a => a.fullName || a.name).join(", ")}. {submission.title}.{" "}
            <em>Global South Journal of Pediatrics</em>.{" "}
            {new Date(publication.publishedDate).getFullYear()}
            {publication.volume && `;${publication.volume}`}
            {publication.issue && `(${publication.issue})`}
            {publication.pages && `:${publication.pages}`}. doi:{publication.doi}
          </div>
        </div>
      </div>
    </div>
  );
}