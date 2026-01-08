import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || ![Role.EDITOR, Role.ADMIN].includes(session.user.role as Role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reviewers = await prisma.user.findMany({
      where: {
        role: { in: ["REVIEWER", "EDITOR"] },
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        specialties: true,
      },
      orderBy: { fullName: "asc" },
    });

    return NextResponse.json({ reviewers });
  } catch (error) {
    console.error("Error fetching reviewers:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}