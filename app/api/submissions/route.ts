// app/api/submissions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || ![Role.AUTHOR, Role.ADMIN].includes(session.user.role as Role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      abstract,
      keywords,
      articleType,
      manuscriptFileUrl,
      figuresUrls,
      wordCount,
      correspondingAuthor,
      coAuthors,
      ethicalApprovalNumber,
      fundingInfo,
      conflictsOfInterest,
    } = body;

    // Validation
    if (!title || !abstract || !articleType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Créer la soumission
    const submission = await prisma.submission.create({
      data: {
        authorId: session.user.id,
        title,
        abstract,
        keywords: keywords ? JSON.stringify(keywords) : null,
        articleType,
        manuscriptFileUrl: manuscriptFileUrl || null,
        figuresUrls: figuresUrls ? JSON.stringify(figuresUrls) : null,
        wordCount: wordCount || null,
        correspondingAuthor: JSON.stringify(correspondingAuthor),
        coAuthors: coAuthors ? JSON.stringify(coAuthors) : null,
        ethicalApprovalNumber: ethicalApprovalNumber || null,
        fundingInfo: fundingInfo || null,
        conflictsOfInterest: conflictsOfInterest || null,
        status: "SUBMITTED",
      },
    });

    // Créer une notification pour l'auteur
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        type: "SUBMISSION_RECEIVED",
        title: "Submission Received",
        message: `Your manuscript "${title}" has been successfully submitted.`,
        link: `/dashboard/author/submissions/${submission.id}`,
      },
    });

    // Créer un log d'activité
    await prisma.activityLog.create({
      data: {
        submissionId: submission.id,
        userId: session.user.id,
        action: "SUBMISSION_CREATED",
        details: JSON.stringify({ title, articleType }),
      },
    });

    return NextResponse.json(
      {
        success: true,
        submissionId: submission.id,
        message: "Submission created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Récupérer les soumissions de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const submissions = await prisma.submission.findMany({
      where: {
        authorId: session.user.id,
      },
      orderBy: {
        submittedAt: "desc",
      },
      select: {
        id: true,
        title: true,
        articleType: true,
        status: true,
        submittedAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error("Fetch submissions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}