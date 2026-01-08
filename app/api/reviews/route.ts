import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || ![Role.EDITOR, Role.ADMIN].includes(session.user.role as Role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { submissionId, reviewerIds } = await request.json();

    // Créer les reviews pour chaque reviewer
    const reviews = await Promise.all(
      reviewerIds.map((reviewerId: string) =>
        prisma.review.create({
          data: {
            submissionId,
            reviewerId,
            status: "INVITED",
            dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks
          },
        })
      )
    );

    // Mettre à jour le statut de la soumission
    await prisma.submission.update({
      where: { id: submissionId },
      data: { status: "UNDER_REVIEW" },
    });

    // Créer des notifications pour chaque reviewer
    await Promise.all(
      reviewerIds.map((reviewerId: string) =>
        prisma.notification.create({
          data: {
            userId: reviewerId,
            type: "REVIEW_INVITATION",
            title: "New Review Invitation",
            message: "You have been invited to review a manuscript.",
            link: `/dashboard/reviewer/reviews/${reviews.find(r => r.reviewerId === reviewerId)?.id}`,
          },
        })
      )
    );

    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error("Error creating reviews:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}