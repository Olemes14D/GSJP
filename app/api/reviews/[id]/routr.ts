import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status, recommendation, commentsToAuthor, commentsToEditor, confidentialComments, reviewQuality } = body;

    // Vérifier que le reviewer est celui assigné
    const review = await prisma.review.findUnique({
      where: { id: params.id },
    });

    if (!review || review.reviewerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Mettre à jour la review
    const updated = await prisma.review.update({
      where: { id: params.id },
      data: {
        status,
        recommendation,
        commentsToAuthor,
        commentsToEditor,
        confidentialComments,
        reviewQuality,
        completedAt: status === "COMPLETED" ? new Date() : null,
      },
    });

    // Créer notification pour l'éditeur
    if (status === "COMPLETED") {
      await prisma.notification.create({
        data: {
          userId: review.reviewerId,
          type: "REVIEW_COMPLETED",
          title: "Review Submitted",
          message: "Your review has been successfully submitted.",
        },
      });
    }

    return NextResponse.json({ success: true, review: updated });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}