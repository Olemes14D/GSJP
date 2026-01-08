// app/articles/page.tsx - PAGE LISTE DES ARTICLES / ARCHIVES
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Search, Calendar, Filter } from "lucide-react";

interface ArchivesPageProps {
  searchParams: { volume?: string; issue?: string; keyword?: string; year?: string };
}

export default async function ArchivesPage({ searchParams }: ArchivesPageProps) {
  const { volume, issue, keyword, year } = searchParams;

  // Construire le filtre
  const where: any = {
    submission: { status: "PUBLISHED" },
  };

  if (volume) where.volume = parseInt(volume);
  if (issue) where.issue = parseInt(issue);
  if (year) {
    where.publishedDate = {
      gte: new Date(`${year}-01-01`),
      lt: new Date(`${parseInt(year) + 1}-01-01`),
    };
  }

  // Récupérer les publications
  const publications = await prisma.publication.findMany({
    where,
    include: {
      submission: {
        select: {
          id: true,
          title: true,
          abstract: true,
          articleType: true,
          keywords: true,
          author: {
            select: { fullName: true },
          },
        },
      },
    },
    orderBy: { publishedDate: "desc" },
  });

  // Filtrer par keyword si nécessaire
  let filteredPublications = publications;
  if (keyword) {
    filteredPublications = publications.filter(p => {
      const keywords = p.submission.keywords 
        ? JSON.parse(p.submission.keywords as string)
        : [];
      return keywords.some((k: string) => 
        k.toLowerCase().includes(keyword.toLowerCase())
      );
    });
  }

  // Stats pour les filtres
  const volumes = await prisma.publication.findMany({
    where: { volume: { not: null } },
    select: { volume: true },
    distinct: ["volume"],
    orderBy: { volume: "desc" },
  });

  const years = Array.from(
    new Set(
      publications.map(p => new Date(p.publishedDate).getFullYear())
    )
  ).sort((a, b) => b - a);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Published Articles</h1>
          <p className="text-gray-600">
            Browse our collection of peer-reviewed research articles
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-2" />
                Volume
              </label>
              <select
                value={volume || ""}
                onChange={(e) => {
                  const params = new URLSearchParams(searchParams as any);
                  if (e.target.value) {
                    params.set("volume", e.target.value);
                  } else {
                    params.delete("volume");
                  }
                  window.location.href = `/articles?${params.toString()}`;
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Volumes</option>
                {volumes.map((v) => (
                  <option key={v.volume} value={v.volume!}>
                    Volume {v.volume}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Year
              </label>
              <select
                value={year || ""}
                onChange={(e) => {
                  const params = new URLSearchParams(searchParams as any);
                  if (e.target.value) {
                    params.set("year", e.target.value);
                  } else {
                    params.delete("year");
                  }
                  window.location.href = `/articles?${params.toString()}`;
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Years</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-2" />
                Search by Keyword
              </label>
              <input
                type="text"
                defaultValue={keyword || ""}
                placeholder="Enter keyword..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const params = new URLSearchParams(searchParams as any);
                    if (e.currentTarget.value) {
                      params.set("keyword", e.currentTarget.value);
                    } else {
                      params.delete("keyword");
                    }
                    window.location.href = `/articles?${params.toString()}`;
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {(volume || year || keyword) && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {filteredPublications.length} article(s)
              </p>
              <Link
                href="/articles"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear Filters
              </Link>
            </div>
          )}
        </div>

        {/* Articles List */}
        <div className="space-y-6">
          {filteredPublications.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-gray-600">No articles found matching your criteria.</p>
            </div>
          ) : (
            filteredPublications.map((publication) => (
              <article
                key={publication.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full mb-2">
                    {publication.submission.articleType.replace(/_/g, " ")}
                  </span>
                  <Link
                    href={`/articles/${publication.id}`}
                    className="block group"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600">
                      {publication.submission.title}
                    </h2>
                  </Link>
                  <p className="text-sm text-gray-600 mb-2">
                    {publication.submission.author.fullName} • {" "}
                    {new Date(publication.publishedDate).toLocaleDateString()}
                    {publication.volume && ` • Vol. ${publication.volume}`}
                    {publication.issue && `, Issue ${publication.issue}`}
                  </p>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-3">
                  {publication.submission.abstract}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>DOI: {publication.doi}</span>
                    <span>•</span>
                    <span>{publication.viewsCount} views</span>
                  </div>
                  <Link
                    href={`/articles/${publication.id}`}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Read Article →
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}