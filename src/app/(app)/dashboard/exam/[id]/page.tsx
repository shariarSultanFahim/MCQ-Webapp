import { getSession } from "@/lib/session";
import {
  Button,
  Card,
  FormControlLabel,
  OutlinedInput,
  Switch,
  Typography,
} from "@mui/material";
import { PrismaClient } from "@prisma/client";
import { redirect, RedirectType } from "next/navigation";
import QuestionsEditor from "./QuestionsEditor";
import ShareExamButton from "./ShareExamButton";

const prisma = new PrismaClient();

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ExamDetailsPage({ params }: PageProps) {
  const user = await getSession();
  const idNum = Number.parseInt((await params).id, 10);

  if (!Number.isFinite(idNum)) {
    redirect("/", RedirectType.replace);
  }

  const exam = await prisma.exam.findUnique({
    where: { id: idNum },
    include: { questions: { orderBy: { id: "asc" } } },
  });

  if (!exam) {
    redirect("/", RedirectType.replace);
  }

  if (!user?.id || Number(user.id) !== exam.ownerId) {
    redirect("/", RedirectType.replace);
  }

  async function updateExam(formData: FormData) {
    "use server";

    const title = formData.get("title")?.toString().trim() || "";
    const description = formData.get("description")?.toString().trim() || null;
    const durationRaw = formData.get("duration")?.toString() || "0";
    const passingScoreRaw = formData.get("passingScore")?.toString() || "0";
    const isPublished = formData.get("isPublished") === "on";

    if (!title) {
      redirect(`/dashboard/exam/${idNum}?error=Title%20is%20required`);
    }

    const duration = Math.max(0, Number.parseInt(durationRaw, 10) || 0);
    const passingScore = Math.max(0, Number.parseInt(passingScoreRaw, 10) || 0);

    // Parse questions (same structure as create page)
    const qCount = Math.max(
      0,
      Number.parseInt(formData.get("q-count")?.toString() || "0", 10) || 0
    );
    const questions: {
      content: string;
      options: string[];
      answer: string | null;
      marks: number;
      isPublished: boolean;
    }[] = [];

    for (let i = 0; i < qCount; i++) {
      const content = formData.get(`q-${i}-content`)?.toString().trim() || "";
      const marks = Math.max(
        1,
        Number.parseInt(formData.get(`q-${i}-marks`)?.toString() || "1", 10) ||
          1
      );
      const isQPublished = formData.get(`q-${i}-isPublished`) === "on";
      const optCount = Math.max(
        0,
        Number.parseInt(
          formData.get(`q-${i}-opt-count`)?.toString() || "0",
          10
        ) || 0
      );

      const options: string[] = [];
      for (let j = 0; j < optCount; j++) {
        const opt = formData.get(`q-${i}-option-${j}`)?.toString().trim();
        if (opt) options.push(opt);
      }

      const answerIndexRaw = formData.get(`q-${i}-answerIndex`)?.toString();
      const answerIndex =
        answerIndexRaw != null ? Number.parseInt(answerIndexRaw, 10) : NaN;
      const answer =
        Number.isFinite(answerIndex) &&
        answerIndex >= 0 &&
        answerIndex < options.length
          ? options[answerIndex]
          : null;

      if (content && options.length >= 2) {
        questions.push({
          content,
          options,
          answer,
          marks,
          isPublished: isQPublished,
        });
      }
    }

    await prisma.exam.update({
      where: { id: idNum },
      data: {
        title,
        description,
        duration,
        passingScore,
        isPublished,
        questions: {
          deleteMany: {}, // replace all questions
          ...(questions.length
            ? {
                create: questions.map((q) => ({
                  content: q.content,
                  options: q.options,
                  answer: q.answer,
                  marks: q.marks,
                  isPublished: q.isPublished,
                })),
              }
            : {}),
        },
      },
    });

    redirect(`/dashboard/exam/${idNum}`, RedirectType.replace);
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h5" component="h1">
          Edit Exam
        </Typography>
        <ShareExamButton id={exam.id} />
      </div>

      <Card
        elevation={0}
        sx={{
          background: "transparent",
          border: "1px solid #0001",
          px: 2,
          py: 2,
        }}
      >
        <form action={updateExam} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Typography variant="caption" component="label" htmlFor="title">
              Title
            </Typography>
            <OutlinedInput
              id="title"
              name="title"
              required
              size="small"
              fullWidth
              placeholder="e.g. JavaScript Basics Quiz"
              defaultValue={exam.title}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Typography
              variant="caption"
              component="label"
              htmlFor="description"
            >
              Description
            </Typography>
            <OutlinedInput
              id="description"
              name="description"
              size="small"
              fullWidth
              placeholder="Optional short description"
              defaultValue={exam.description ?? ""}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Typography
                variant="caption"
                component="label"
                htmlFor="duration"
              >
                Duration (minutes)
              </Typography>
              <OutlinedInput
                id="duration"
                name="duration"
                type="number"
                inputProps={{ min: 0, step: 1 }}
                size="small"
                fullWidth
                defaultValue={exam.duration}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Typography
                variant="caption"
                component="label"
                htmlFor="passingScore"
              >
                Passing Score
              </Typography>
              <OutlinedInput
                id="passingScore"
                name="passingScore"
                type="number"
                inputProps={{ min: 0, step: 1 }}
                size="small"
                fullWidth
                defaultValue={exam.passingScore}
              />
            </div>
          </div>

          <FormControlLabel
            control={
              <Switch
                name="isPublished"
                color="primary"
                defaultChecked={exam.isPublished}
              />
            }
            label="Publish exam"
          />

          {/* Questions editor (prefilled) */}
          <QuestionsEditor
            initialQuestions={exam.questions.map((q) => ({
              content: q.content,
              options: q.options,
              answer: q.answer,
              marks: q.marks,
              isPublished: q.isPublished,
            }))}
          />

          <div className="flex justify-end gap-2">
            <Button
              component="a"
              href="/dashboard"
              variant="outlined"
              className="!h-10"
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" className="!h-10">
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
}
