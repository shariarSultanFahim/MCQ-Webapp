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
import QuestionsBuilder from "./QuestionsBuilder";

const prisma = new PrismaClient();

export default async function CreateExamPage() {
  const user = await getSession();

  async function createExam(formData: FormData) {
    "use server";

    const title = formData.get("title")?.toString().trim() || "";
    const description = formData.get("description")?.toString().trim() || null;
    const durationRaw = formData.get("duration")?.toString() || "0";
    const passingScoreRaw = formData.get("passingScore")?.toString() || "0";
    const isPublished = formData.get("isPublished") === "on";

    if (!user?.id) {
      redirect("/login");
    }

    if (!title) {
      redirect("/dashboard/create?error=Title%20is%20required");
    }

    const duration = Math.max(0, Number.parseInt(durationRaw, 10) || 0);
    const passingScore = Math.max(0, Number.parseInt(passingScoreRaw, 10) || 0);

    // Parse questions from form data
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

      // Only include valid questions with content and at least 2 options
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

    const newExam = await prisma.exam.create({
      data: {
        title,
        description,
        duration,
        passingScore,
        isPublished,
        ownerId: Number(user!.id),
        questions: questions.length
          ? {
              create: questions.map((q) => ({
                content: q.content,
                options: q.options,
                answer: q.answer,
                marks: q.marks,
                isPublished: q.isPublished,
              })),
            }
          : undefined,
      },
    });

    // Optional: redirect after creation
    redirect(`/dashboard/exam/${newExam.id}`, RedirectType.replace);
  }

  return (
    <section>
      <Typography variant="h5" component="h1" className="mb-4">
        Create Exam
      </Typography>

      <Card
        elevation={0}
        sx={{
          background: "transparent",
          border: "1px solid #0001",
          px: 2,
          py: 2,
        }}
      >
        <form action={createExam} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Typography variant="caption" component="label" htmlFor="title">
              Title
            </Typography>
            <OutlinedInput
              id="title"
              name="title"
              required
              placeholder="e.g. JavaScript Basics Quiz"
              size="small"
              fullWidth
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
              placeholder="Optional short description"
              size="small"
              fullWidth
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
                required
                id="duration"
                name="duration"
                type="number"
                inputProps={{ min: 0, step: 1 }}
                placeholder="0"
                size="small"
                fullWidth
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
                placeholder="0"
                size="small"
                fullWidth
              />
            </div>
          </div>

          <FormControlLabel
            control={<Switch name="isPublished" color="primary" />}
            label="Publish exam"
          />

          {/* Questions builder */}
          <QuestionsBuilder />

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
              Save Exam
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
}
