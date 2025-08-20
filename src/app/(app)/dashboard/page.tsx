import { getSession } from "@/lib/session";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardActionArea,
  Grid,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { redirect, RedirectType } from "next/navigation";

import { PrismaClient, Exam, AnswerSheet } from "@prisma/client";
function ExamCard({ exam }: { exam: Exam }) {
  return (
    <Grid size={{ xs: 12, md: 4, sm: 6 }}>
      {" "}
      <CardActionArea href={`/dashboard/exam/${exam.id}`}>
        <Card
          elevation={0}
          sx={{
            background: "transparent",
            border: "1px solid #0001",
            px: 2,
            py: 1,
          }}
        >
          <Typography variant="body2">{exam?.title}</Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {exam?.createdAt?.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>
        </Card>{" "}
      </CardActionArea>
    </Grid>
  );
}

function ResultCard({
  given_exams,
}: {
  given_exams: AnswerSheet & { exam: Exam };
}) {
  return (
    <Grid size={{ xs: 12, md: 4, sm: 6 }}>
      <CardActionArea href={`/dashboard/result/${given_exams.exam.id}`}>
        <Card
          elevation={0}
          sx={{
            background: "transparent",
            border: "1px solid #0001",
            px: 2,
            py: 1,
          }}
        >
          <Typography variant="body2">{given_exams?.exam?.title}</Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {given_exams?.createdAt?.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>
        </Card>
      </CardActionArea>
    </Grid>
  );
}
const prisma = new PrismaClient();
export default async function DashboardPage() {
  const user = await getSession();
  const userData = await prisma.user.findUnique({
    where: {
      id: user?.id ? Number(user.id) : undefined,
    },
    include: {
      exams: true,
      given_exams: {
        include: {
          exam: true,
        },
      },
    },
  });

  async function joinExam(formData: FormData) {
    "use server";
    const examCode = formData.get("examCode")?.toString()?.trim();
    if (!examCode) return;
    redirect(`/dashboard/start/${examCode}`, RedirectType.replace);
  }

  return (
    <section>
      <div className="flex flex-col md:flex-row justify-between items-center my-8 gap-4">
        <form action={joinExam} className="flex  gap-2">
          <div>
            <OutlinedInput
              fullWidth
              id="exam-code"
              type="text"
              name="examCode"
              placeholder="Enter Exam Code"
              required
              size="small"
            />
          </div>
          <Button type="submit" variant="contained" className="!h-10">
            Join Exam
          </Button>
        </form>
        <Button
          href="/dashboard/create"
          component="a"
          className="!h-10"
          variant="contained"
        >
          Create Exam
        </Button>
      </div>
      <Accordion
        sx={{
          bgcolor: "transparent",
        }}
        elevation={0}
        defaultExpanded
      >
        <AccordionSummary
          expandIcon={<HugeiconsIcon icon={ArrowDown01Icon} />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span">
            My Exams ({userData?.exams?.length})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={1}>
            {userData?.exams?.map((exam) => (
              <ExamCard key={exam?.id} exam={exam} />
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion
        sx={{
          bgcolor: "transparent",
        }}
        elevation={0}
        defaultExpanded
      >
        <AccordionSummary
          expandIcon={<HugeiconsIcon icon={ArrowDown01Icon} />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography component="span">
            My Results ({userData?.given_exams?.length})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={1}>
            {userData?.given_exams?.map((given_exam) => (
              <ResultCard key={given_exam?.id} given_exams={given_exam} />
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </section>
  );
}
