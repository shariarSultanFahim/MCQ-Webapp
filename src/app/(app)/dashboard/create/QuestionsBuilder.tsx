"use client";

import { useState } from "react";
import {
  Button,
  Card,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  OutlinedInput,
  Radio,
  RadioGroup,
  Switch,
  Typography,
} from "@mui/material";
import { HugeiconsIcon } from "@hugeicons/react";
import { AddInvoiceIcon, Delete02Icon } from "@hugeicons/core-free-icons";

type QuestionMeta = {
  id: string;
  optionCount: number;
};

export default function QuestionsBuilder() {
  const [questions, setQuestions] = useState<QuestionMeta[]>([
    { id: crypto.randomUUID(), optionCount: 4 },
  ]);

  const addQuestion = () => {
    setQuestions((q) => [...q, { id: crypto.randomUUID(), optionCount: 4 }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions((q) => q.filter((_, i) => i !== index));
  };

  const addOption = (qIndex: number) => {
    setQuestions((q) =>
      q.map((item, i) =>
        i === qIndex ? { ...item, optionCount: item.optionCount + 1 } : item
      )
    );
  };

  const removeOption = (qIndex: number) => {
    setQuestions((q) =>
      q.map((item, i) =>
        i === qIndex && item.optionCount > 2
          ? { ...item, optionCount: item.optionCount - 1 }
          : item
      )
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <Typography variant="subtitle1" component="h2">
        Questions
      </Typography>

      {/* Let server action know how many questions */}
      <input type="hidden" name="q-count" value={questions.length} />

      {questions.map((q, qIndex) => (
        <Card
          key={q.id}
          variant="outlined"
          className=" !bg-white/10 !shadow-2xl !ring-1 !ring-black/5 !backdrop-blur-3xl"
          sx={{ px: 2, py: 2, borderColor: "#0001" }}
        >
          <div className="flex items-start justify-between gap-2">
            <Typography variant="subtitle2">Question {qIndex + 1}</Typography>
            <IconButton
              aria-label="Remove question"
              size="small"
              onClick={() => removeQuestion(qIndex)}
            >
              <HugeiconsIcon icon={Delete02Icon} />
            </IconButton>
          </div>

          <div className="mt-3 flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <Typography
                variant="caption"
                component="label"
                htmlFor={`q-${qIndex}-content`}
              >
                Content
              </Typography>
              <OutlinedInput
                id={`q-${qIndex}-content`}
                name={`q-${qIndex}-content`}
                placeholder="Enter the question"
                size="small"
                fullWidth
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <Typography
                  variant="caption"
                  component="label"
                  htmlFor={`q-${qIndex}-marks`}
                >
                  Marks
                </Typography>
                <OutlinedInput
                  id={`q-${qIndex}-marks`}
                  name={`q-${qIndex}-marks`}
                  type="number"
                  inputProps={{ min: 1, step: 1 }}
                  placeholder="1"
                  size="small"
                  fullWidth
                />
              </div>

              <div className="flex items-center">
                <FormControlLabel
                  control={
                    <Switch
                      name={`q-${qIndex}-isPublished`}
                      color="primary"
                      defaultChecked
                    />
                  }
                  label="Publish question"
                />
              </div>
            </div>

            <Divider />

            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ fontSize: 12, mb: 1 }}>
                Options (select the correct one)
              </FormLabel>
              {/* Let server action know option count for this question */}
              <input
                type="hidden"
                name={`q-${qIndex}-opt-count`}
                value={q.optionCount}
              />
              <RadioGroup name={`q-${qIndex}-answerIndex`}>
                <div className="flex flex-col gap-2">
                  {Array.from({ length: q.optionCount }).map((_, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <FormControlLabel
                        control={<Radio size="small" value={optIndex} />}
                        label=""
                      />
                      <OutlinedInput
                        name={`q-${qIndex}-option-${optIndex}`}
                        placeholder={`Option ${optIndex + 1}`}
                        size="small"
                        fullWidth
                      />
                    </div>
                  ))}
                </div>
              </RadioGroup>

              <div className="mt-2 flex flex-wrap gap-2">
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<HugeiconsIcon icon={AddInvoiceIcon} />}
                  onClick={() => addOption(qIndex)}
                >
                  Add option
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="warning"
                  onClick={() => removeOption(qIndex)}
                  disabled={q.optionCount <= 2}
                >
                  Remove option
                </Button>
              </div>
            </FormControl>
          </div>
        </Card>
      ))}

      <div>
        <Button
          variant="outlined"
          startIcon={<HugeiconsIcon icon={AddInvoiceIcon} />}
          onClick={addQuestion}
        >
          Add question
        </Button>
      </div>
    </div>
  );
}
