import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/session";
import { redirect, RedirectType } from "next/navigation";

const prisma = new PrismaClient();

interface ResultPageProps {
  params: Promise<{ id: string }>;
}

function formatSeconds(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default async function ResultPage({ params }: ResultPageProps) {
  const user = await getSession();
  if (!user?.email) redirect("/dashboard", RedirectType.replace);

  const { id } = await params; // id = AnswerSheet id
  const attemptId = Number.parseInt(id, 10);
  if (!Number.isFinite(attemptId)) redirect("/dashboard", RedirectType.replace);

  const attempt = await prisma.answerSheet.findUnique({
    where: { id: attemptId },
    include: {
      user: { select: { id: true, email: true, full_name: true } },
      exam: {
        select: {
          id: true,
          title: true,
          description: true,
          duration: true,
          passingScore: true,
          questions: {
            select: { id: true, marks: true },
            orderBy: { id: "asc" },
          },
        },
      },
      answers: {
        include: {
          question: {
            select: {
              id: true,
              content: true,
              options: true,
              answer: true,
              marks: true,
            },
          },
        },
        orderBy: { questionId: "asc" },
      },
    },
  });

  if (!attempt || attempt.user.email !== user.email) {
    redirect("/dashboard", RedirectType.replace);
  }

  const totalMarks =
    attempt.exam.questions.reduce((acc, q) => acc + (q.marks ?? 1), 0) || 0;

  const correctness = attempt.answers.map((a) => {
    const isCorrect = a.answer === (a.question.answer ?? null);
    const marks = a.question.marks ?? 1;
    return { isCorrect, marks };
  });

  const earnedMarks = correctness.reduce(
    (acc, c) => acc + (c.isCorrect ? c.marks : 0),
    0
  );

  return (
    <section style={{ maxWidth: 960, margin: "24px auto", padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>{attempt.exam.title}</h1>
      {attempt.exam.description ? (
        <p style={{ marginTop: 8 }}>{attempt.exam.description}</p>
      ) : null}

      <div
        style={{
          marginTop: 16,
          padding: 12,
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          display: "grid",
          gap: 8,
        }}
      >
        <div>
          Score: <strong>{attempt.score}</strong> / {totalMarks}
        </div>
        <div>
          Result:{" "}
          <strong style={{ color: attempt.is_passed ? "#065f46" : "#991b1b" }}>
            {attempt.is_passed ? "Passed" : "Failed"}
          </strong>
        </div>
        <div>Passing Score: {attempt.exam.passingScore}</div>
        <div>Duration Allowed: {attempt.exam.duration} min</div>
        <div>Submitted At: {attempt.updatedAt.toLocaleString()}</div>
      </div>

      <div
        style={{
          marginTop: 24,
          display: "flex",
          gap: 8,
          justifyContent: "flex-end",
        }}
      >
        <a
          href="/dashboard"
          style={{
            padding: "8px 12px",
            border: "1px solid #e5e7eb",
            borderRadius: 6,
            textDecoration: "none",
          }}
        >
          Back to Dashboard
        </a>
      </div>
    </section>
  );
}
