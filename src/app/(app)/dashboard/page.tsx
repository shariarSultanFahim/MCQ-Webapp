import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  Grid,
  Typography,
} from "@mui/material";
import { PrismaClient } from "@prisma/client";
function ExamCard() {
  return (
    <Grid size={{ xs: 12, md: 4, sm: 6 }}>
      <Card
        elevation={0}
        sx={{
          background: "transparent",
          border: "1px solid #0001",
          px: 2,
          py: 1,
        }}
      >
        <Typography variant="body2">Exam Card</Typography>
        <Typography variant="subtitle2" color="text.secondary">
          2023-10-01
        </Typography>
      </Card>
    </Grid>
  );
}

function ResultCard() {
  return (
    <Grid size={{ xs: 12, md: 4, sm: 6 }}>
      <Card
        elevation={0}
        sx={{
          background: "transparent",
          border: "1px solid #0001",
          px: 2,
          py: 1,
        }}
      >
        <Typography variant="body2">Result Card</Typography>
        <Typography variant="subtitle2" color="text.secondary">
          2023-10-01
        </Typography>
      </Card>
    </Grid>
  );
}
const prisma = new PrismaClient();
export default async function DashboardPage() {
  const exams = await prisma.user.findMany({});
  console.log("Exams:", exams);

  return (
    <section>
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
          <Typography component="span">My Exams (0)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={1}>
            <ExamCard />
            <ExamCard />
            <ExamCard />
            <ExamCard />
            <ExamCard />
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion
        sx={{
          bgcolor: "transparent",
        }}
        elevation={0}
      >
        <AccordionSummary
          expandIcon={<HugeiconsIcon icon={ArrowDown01Icon} />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography component="span">My Results (0)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={1}>
            <ResultCard />
            <ResultCard />
            <ResultCard />
            <ResultCard />
            <ResultCard />
          </Grid>
        </AccordionDetails>
      </Accordion>
    </section>
  );
}
