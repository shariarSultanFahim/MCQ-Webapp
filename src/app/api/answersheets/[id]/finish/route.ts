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
    if (!user?.email)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const attemptId = Number.parseInt(id, 10);
    if (!Number.isFinite(attemptId))
      return NextResponse.json(
        { message: "Invalid attempt id" },
        { status: 400 }
      );

    const attempt = await prisma.answerSheet.findUnique({
      where: { id: attemptId },
      include: {
        user: { select: { email: true } },
        exam: {
          select: {
            id: true,
            duration: true,
            passingScore: true,
            questions: {
              select: { id: true, marks: true, answer: true },
            },
          },
        },
        answers: {
          select: { questionId: true, answer: true },
        },
      },
    });

    if (!attempt || attempt.user.email !== user.email) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    if (attempt.completed_duration > 0) {
      return NextResponse.json(
        { score: attempt.score, isPassed: attempt.is_passed },
        { status: 200 }
      );
    }

    const now = Date.now();
    const started = attempt.createdAt.getTime();
    const durationMs = attempt.exam.duration * 60 * 1000;
    const secondsTaken = Math.min(
      Math.floor((now - started) / 1000),
      Math.floor(durationMs / 1000)
    );

    // Score calculation
    const correctMap = new Map<
      number,
      { answer: string | null; marks: number }
    >(
      attempt.exam.questions.map((q) => [
        q.id,
        { answer: q.answer ?? null, marks: q.marks ?? 0 },
      ])
    );

    let score = 0;
    for (const ans of attempt.answers) {
      const spec = correctMap.get(ans.questionId);
      if (!spec) continue;
      if (spec.answer != null && ans.answer === spec.answer) {
        score += spec.marks;
      }
    }

    const isPassed = score >= attempt.exam.passingScore;

    const updated = await prisma.answerSheet.update({
      where: { id: attemptId },
      data: {
        score,
        is_passed: isPassed,
        completed_duration: secondsTaken,
      },
      select: { score: true, is_passed: true },
    });

    return NextResponse.json({
      score: updated.score,
      isPassed: updated.is_passed,
    });
  } catch (e) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
