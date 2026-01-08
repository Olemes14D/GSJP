import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || ![Role.EDITOR, Role.ADMIN].includes(session.user.role as Role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { decision, comments } = await request.json();

    // Mettre à jour la soumission
    const submission = await prisma.submission.update({
      where: { id: params.id },
      data: { status: decision },
    });

    // Créer notification pour l'auteur
    await prisma.notification.create({
      data: {
        userId: submission.authorId,
        type: "DECISION_MADE",
        title: `Editorial Decision: ${decision.replace(/_/g, " ")}`,
        message: comments || `Your submission has been ${decision.toLowerCase().replace(/_/g, " ")}.`,
        link: `/dashboard/author/submissions/${submission.id}`,
      },
    });

    // Log d'activité
    await prisma.activityLog.create({
      data: {
        submissionId: submission.id,
        userId: session.user.id,
        action: "DECISION_MADE",
        details: JSON.stringify({ decision, comments }),
      },
    });

    return NextResponse.json({ success: true, submission });
  } catch (error) {
    console.error("Error making decision:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}