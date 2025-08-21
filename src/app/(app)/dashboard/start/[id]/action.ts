"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function checkAttempt(examId: number, userRecord: { id: number }) {
  "use server";
  const attempt = await prisma.answerSheet.findFirst({
    where: { examId: examId, userId: userRecord.id },
    select: { id: true, completed_duration: true, createdAt: true },
  });
  return attempt;
}
