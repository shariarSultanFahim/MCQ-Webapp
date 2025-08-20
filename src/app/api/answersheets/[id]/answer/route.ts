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

    const body = (await req.json().catch(() => null)) as {
      questionId?: number;
      answer?: string;
    };
    if (!body?.questionId || typeof body.answer !== "string") {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const attempt = await prisma.answerSheet.findUnique({
      where: { id: attemptId },
      include: {
        exam: { select: { duration: true } },
        user: { select: { email: true } },
      },
    });
    if (!attempt || attempt.user.email !== user.email)
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    if (attempt.completed_duration > 0)
      return NextResponse.json(
        { message: "Exam already finished" },
        { status: 409 }
      );

    const deadline =
      attempt.createdAt.getTime() + attempt.exam.duration * 60 * 1000;
    if (Date.now() > deadline)
      return NextResponse.json({ message: "Time over" }, { status: 403 });

    const existing = await prisma.answerSheetQuestionJunction.findFirst({
      where: { answerSheetId: attemptId, questionId: body.questionId },
      select: { id: true },
    });

    if (existing) {
      await prisma.answerSheetQuestionJunction.update({
        where: { id: existing.id },
        data: { answer: body.answer },
      });
    } else {
      await prisma.answerSheetQuestionJunction.create({
        data: {
          answer: body.answer,
          answerSheetId: attemptId,
          questionId: body.questionId,
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
