"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { checkAttempt } from "./action";

type ExamClientData = {
  id: number;
  title: string;
  durationMin: number;
  passingScore: number;
  totalMarks: number;
  questionCount: number;
  description: string | null;
};

type Status = {
  isTaken: boolean;
  score: number | null;
  isPassed: boolean | null;
  hasOngoingAttempt: boolean;
  attemptId: number | null;
  startedAt: string | null;
  remainingSeconds: number | null;
};

type Question = {
  id: number;
  content: string;
  options: string[];
  marks: number;
  savedAnswer: string | null;
};

export default function TakeExam({
  exam,
  status: initialStatus,
  user,
}: {
  exam: ExamClientData;
  status: Status;
  user: { id: number; email: string };
}) {
  const [status, setStatus] = useState<Status>(initialStatus);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [remaining, setRemaining] = useState<number | null>(
    initialStatus.remainingSeconds
  );
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    isPassed: boolean;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const started = useMemo(
    () => status.hasOngoingAttempt && status.attemptId != null,
    [status]
  );

  useEffect(() => {
    if (status.isTaken && status.score != null && status.isPassed != null) {
      setResult({ score: status.score, isPassed: status.isPassed });
    }
  }, [status]);

  useEffect(() => {
    if (remaining == null || status.isTaken || !started) return;
    // Do not auto-submit when time is up; only user click should submit
    if (remaining <= 0) return;

    const t = setInterval(() => {
      setRemaining((prev) => (prev == null ? null : Math.max(0, prev - 1)));
    }, 1000);
    return () => clearInterval(t);
  }, [remaining, started, status.isTaken]);

  const fetchQuestions = useCallback(
    async (attemptId: number) => {
      const res = await fetch(
        `/api/exams/${exam.id}/questions?attemptId=${attemptId}`,
        { method: "GET" }
      );

      console.log(
        "Fetching questions for attempt",
        attemptId,
        "response:",
        res
      );

      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.message || "Failed to load questions");
      }
      const j = (await res.json()) as {
        questions: Question[];
        remainingSeconds: number | null;
      };
      setQuestions(j.questions);
      // Pre-fill local answers from savedAnswer if resuming
      const prefilled: Record<number, string> = {};
      j.questions.forEach((q) => {
        if (q.savedAnswer) prefilled[q.id] = q.savedAnswer;
      });
      setAnswers(prefilled);
      if (typeof j.remainingSeconds === "number") {
        setRemaining(j.remainingSeconds);
      }
    },
    [exam.id]
  );

  // Check if we have an ongoing attempt and fetch questions
  useEffect(() => {
    const checkAndFetch = async () => {
      const attempt = await checkAttempt(exam.id, { id: user.id });
      console.log("attempt", attempt);
      if (attempt) {
        if (status.attemptId != null) {
          fetchQuestions(status.attemptId);
        }
      } else {
        setQuestions(null);
        setRemaining(null);
      }
    };
    checkAndFetch();
  }, [exam.id, user.id, status.attemptId, fetchQuestions]);

  const handleStart = useCallback(async () => {
    setError(null);
    const res = await fetch(`/api/exams/${exam.id}/start`, { method: "POST" });
    const j = await res.json().catch(() => null);
    if (!res.ok) {
      setError(j?.message || "Cannot start exam");
      return;
    }
    setStatus((s) => ({
      ...s,
      hasOngoingAttempt: j.hasOngoingAttempt,
      attemptId: j.attemptId,
      isTaken: false,
    }));
    setRemaining(j.remainingSeconds);
    await fetchQuestions(j.attemptId);
  }, [exam.id, fetchQuestions]);

  const setAnswer = useCallback((q: Question, choice: string) => {
    setAnswers((prev) => ({ ...prev, [q.id]: choice }));
  }, []);

  const submitAllAndFinish = useCallback(async () => {
    if (!status.attemptId || submitting || status.isTaken) return;
    setSubmitting(true);
    setError(null);
    try {
      // Send all selected answers (only now)
      const entries = Object.entries(answers); // [ [questionIdStr, answer], ... ]
      if (entries.length) {
        await Promise.all(
          entries.map(([qidStr, ans]) =>
            fetch(`/api/answersheets/${status.attemptId}/answer`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ questionId: Number(qidStr), answer: ans }),
            })
          )
        );
      }

      // Finish
      const finishRes = await fetch(
        `/api/answersheets/${status.attemptId}/finish`,
        { method: "POST" }
      );
      const finishJson = await finishRes.json().catch(() => null);
      if (!finishRes.ok) {
        throw new Error(finishJson?.message || "Failed to finish exam");
      }
      setStatus((s) => ({ ...s, isTaken: true }));
      setResult({ score: finishJson.score, isPassed: finishJson.isPassed });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }, [answers, status.attemptId, status.isTaken, submitting]);

  if (result && status.isTaken) {
    return (
      <div style={{ maxWidth: 720, margin: "24px auto", padding: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>{exam.title}</h1>
        <p style={{ marginTop: 8 }}>You have already taken this exam.</p>
        <div
          style={{
            marginTop: 16,
            padding: 12,
            border: "1px solid #e5e7eb",
            borderRadius: 8,
          }}
        >
          <div>Score: {result.score}</div>
          <div>Result: {result.isPassed ? "Passed" : "Failed"}</div>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div style={{ maxWidth: 720, margin: "24px auto", padding: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>{exam.title}</h1>
        {exam.description ? (
          <p style={{ marginTop: 8 }}>{exam.description}</p>
        ) : null}
        <div style={{ marginTop: 16, display: "grid", gap: 8 }}>
          <div>Duration: {exam.durationMin} min</div>
          <div>Questions: {exam.questionCount}</div>
          <div>Passing Score: {exam.passingScore}</div>
          <div>Total Marks: {exam.totalMarks}</div>
        </div>
        {error ? (
          <p style={{ color: "crimson", marginTop: 8 }}>{error}</p>
        ) : null}
        <button
          onClick={handleStart}
          style={{
            marginTop: 16,
            padding: "10px 16px",
            background: "#111827",
            color: "white",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          {initialStatus.hasOngoingAttempt ? "Resume Exam" : "Start Exam"}
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 960, margin: "24px auto", padding: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>{exam.title}</h1>
        <div>
          Time left:{" "}
          <strong>
            {remaining != null
              ? `${Math.floor(remaining / 60)}:${String(
                  remaining % 60
                ).padStart(2, "0")}`
              : "--:--"}
          </strong>
        </div>
      </div>

      {error ? <p style={{ color: "crimson", marginTop: 8 }}>{error}</p> : null}

      {!questions ? (
        <p style={{ marginTop: 16 }}>Loading questions…</p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitAllAndFinish();
          }}
          onKeyDown={(e) => {
            // Avoid implicit submit via Enter key; must click the Submit button
            if (e.key === "Enter") e.preventDefault();
          }}
        >
          {questions.map((q, qi) => (
            <div
              key={q.id}
              style={{
                marginTop: 16,
                padding: 12,
                border: "1px solid #e5e7eb",
                borderRadius: 8,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>Q{qi + 1}</div>
                <div>Marks: {q.marks}</div>
              </div>
              <div style={{ marginTop: 12, fontWeight: 600 }}>{q.content}</div>
              <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                {q.options.map((opt, oi) => (
                  <label
                    key={`${q.id}-${oi}`}
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={(e) => setAnswer(q, e.target.value)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div
            style={{
              marginTop: 12,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                background: "#047857",
                color: "white",
              }}
            >
              {submitting ? "Submitting…" : "Submit"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
