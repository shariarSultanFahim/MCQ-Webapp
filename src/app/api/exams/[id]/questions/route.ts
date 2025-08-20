import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/session";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();
    if (!user?.email)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const idNum = Number.parseInt(id, 10);
    if (!Number.isFinite(idNum))
      return NextResponse.json({ message: "Invalid exam id" }, { status: 400 });

    const attemptId = Number.parseInt(
      new URL(req.url).searchParams.get("attemptId") || "",
      10
    );
    if (!Number.isFinite(attemptId))
      return NextResponse.json(
        { message: "Invalid attempt id" },
        { status: 400 }
      );

    const userRecord = await prisma.user.findUnique({
      where: { email: user.email },
      select: { id: true },
    });
    if (!userRecord)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const attempt = await prisma.answerSheet.findUnique({
      where: { id: attemptId },
      select: {
        id: true,
        examId: true,
        userId: true,
        createdAt: true,
        completed_duration: true,
        exam: { select: { duration: true } },
      },
    });
    if (
      !attempt ||
      attempt.userId !== userRecord.id ||
      attempt.examId !== idNum
    ) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    if (attempt.completed_duration > 0) {
      return NextResponse.json(
        { message: "Exam already finished" },
        { status: 409 }
      );
    }

    const exam = await prisma.exam.findUnique({
      where: { id: idNum },
      select: {
        id: true,
        questions: {
          where: { isPublished: true },
          orderBy: { id: "asc" },
          select: {
            id: true,
            content: true,
            options: true,
            marks: true,
            AnswerSheetQuestionJunction: {
              where: { answerSheetId: attemptId },
              select: { answer: true },
            },
          },
        },
      },
    });
    if (!exam)
      return NextResponse.json({ message: "Not found" }, { status: 404 });

    const durationSec = attempt.exam.duration * 60;
    const elapsed = Math.floor(
      (Date.now() - attempt.createdAt.getTime()) / 1000
    );
    const remainingSeconds = Math.max(0, durationSec - elapsed);

    const questions = exam.questions.map((q) => ({
      id: q.id,
      content: q.content,
      options: q.options,
      marks: q.marks,
      savedAnswer: q.AnswerSheetQuestionJunction[0]?.answer ?? null,
    }));

    return NextResponse.json({ questions, remainingSeconds });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
