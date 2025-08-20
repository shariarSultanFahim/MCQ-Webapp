import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/session";

const prisma = new PrismaClient();

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();
    if (!user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const idNum = Number.parseInt(id, 10);
    if (!Number.isFinite(idNum)) {
      return NextResponse.json({ message: "Invalid exam id" }, { status: 400 });
    }

    const [userRecord, exam] = await Promise.all([
      prisma.user.findUnique({
        where: { email: user.email },
        select: { id: true },
      }),
      prisma.exam.findUnique({
        where: { id: idNum, isPublished: true },
        select: { id: true, duration: true },
      }),
    ]);
    if (!userRecord || !exam) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    let attempt = await prisma.answerSheet.findFirst({
      where: { examId: exam.id, userId: userRecord.id },
      select: { id: true, completed_duration: true, createdAt: true },
    });

    // Already finished => no new attempts (one-time policy)
    if (attempt && attempt.completed_duration > 0) {
      return NextResponse.json(
        { message: "You have already taken this exam." },
        { status: 409 }
      );
    }

    if (!attempt) {
      attempt = await prisma.answerSheet.create({
        data: {
          userId: userRecord.id,
          examId: exam.id,
        },
        select: { id: true, completed_duration: true, createdAt: true },
      });
    }

    const durationSec = exam.duration * 60;
    const elapsed = Math.floor(
      (Date.now() - attempt.createdAt.getTime()) / 1000
    );
    const remainingSeconds = Math.max(0, durationSec - elapsed);

    return NextResponse.json({
      attemptId: attempt.id,
      remainingSeconds,
      hasOngoingAttempt: true,
    });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
