"use client";

import dynamic from "next/dynamic";

const TakeExam = dynamic(() => import("./TakeExam"), { ssr: false });

type ExamClientData = {
  id: number;
  title: string;
  durationMin: number;
  passingScore: number;
  totalMarks: number;
  questionCount: number;
  description: string | null;
};

type UserInfo = { name: string | null; email: string | null };

type Status = {
  isTaken: boolean;
  score: number | null;
  isPassed: boolean | null;
  hasOngoingAttempt: boolean;
  attemptId: number | null;
  startedAt: string | null;
  remainingSeconds: number | null;
};

export default function StartExamClient(props: {
  exam: ExamClientData;
  user: UserInfo;
  status: Status;
}) {
  return <TakeExam {...props} />;
}
