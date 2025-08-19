"use client";

import { FormControlLabel, Switch } from "@mui/material";
import { useEffect, useState } from "react";

export default function PublishSwitch() {
  const [hasQuestions, setHasQuestions] = useState(false);

  useEffect(() => {
    const readCount = () => {
      const input = document.querySelector<HTMLInputElement>(
        'input[name="q-count"]'
      );
      const n = parseInt(input?.value ?? "0", 10);
      setHasQuestions(Number.isFinite(n) && n > 0);
    };

    // Initial check
    readCount();

    // Update when the form or hidden inputs change
    const handler = () => readCount();
    document.addEventListener("input", handler, true);
    document.addEventListener("change", handler, true);
    return () => {
      document.removeEventListener("input", handler, true);
      document.removeEventListener("change", handler, true);
    };
  }, []);

  return (
    <FormControlLabel
      control={
        <Switch name="isPublished" color="primary" disabled={!hasQuestions} />
      }
      label={
        hasQuestions ? "Publish exam" : "Publish exam (add at least 1 question)"
      }
    />
  );
}
