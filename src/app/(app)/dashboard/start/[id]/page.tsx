import { PrismaClient } from "@prisma/client";
import { redirect, RedirectType } from "next/navigation";

import { getSession } from "@/lib/session";
import StartExamClient from "./StartExamClient";

const prisma = new PrismaClient();

interface StartExamPageProps {
  params: Promise<{ id: string }>;
}

export default async function StartExamPage({ params }: StartExamPageProps) {
  const { id } = await params;
  console.log("Exam ID:", id);
  const user = await getSession();
  if (!user?.email) redirect("/dashboard", RedirectType.replace);

  const idNum = Number.parseInt(id, 10);
  if (!Number.isFinite(idNum)) redirect("/dashboard", RedirectType.replace);

  const exam = await prisma.exam.findUnique({
    where: { id: idNum, isPublished: true },
    include: {
      questions: {
        where: { isPublished: true },
        select: { id: true, marks: true },
        orderBy: { id: "asc" },
      },
    },
  });
  if (!exam) return <div>Exam code is invalid</div>;

  if (!exam || exam.questions.length === 0)
    return <div>This exam is not started yet</div>;

  const userRecord = await prisma.user.findUnique({
    where: { email: user.email },
    select: { id: true, full_name: true, email: true },
  });

  if (!userRecord) redirect("/dashboard", RedirectType.replace);

  const attempt = await prisma.answerSheet.findFirst({
    where: { examId: idNum, userId: userRecord.id },
    select: {
      id: true,
      score: true,
      is_passed: true,
      completed_duration: true,
      createdAt: true,
    },
  });

  const isFinished = !!attempt && attempt.completed_duration > 0;
  const hasOngoingAttempt = !!attempt && attempt.completed_duration === 0;

  let remainingSeconds: number | null = null;
  if (hasOngoingAttempt && attempt) {
    const startedAt = attempt.createdAt.getTime();
    const now = Date.now();
    const durationSec = exam.duration * 60;
    const elapsed = Math.floor((now - startedAt) / 1000);
    remainingSeconds = Math.max(0, durationSec - elapsed);
  }

  const totalMarks = exam.questions.reduce((acc, q) => acc + (q.marks ?? 0), 0);
  const questionCount = exam?.questions.length;

  return (
    <StartExamClient
      exam={{
        id: exam.id,
        title: exam.title,
        durationMin: exam.duration,
        passingScore: exam.passingScore,
        totalMarks,
        questionCount,
        description: exam.description ?? null,
      }}
      user={{
        name: userRecord.full_name ?? null,
        email: userRecord.email,
        id: userRecord.id,
      }}
      status={{
        isTaken: isFinished,
        score: attempt?.score ?? null,
        isPassed: attempt?.is_passed ?? null,
        hasOngoingAttempt,
        attemptId: attempt?.id ?? null,
        startedAt: attempt?.createdAt?.toISOString() ?? null,
        remainingSeconds,
      }}
    />
  );
}
