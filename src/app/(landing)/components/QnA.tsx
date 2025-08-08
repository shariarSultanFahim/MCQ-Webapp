// src/components/QnaSection.tsx
"use client";

import {
  ArrowDown01FreeIcons,
  ArrowUp01FreeIcons,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";

const faqs = [
  {
    question: "Is this platform free for tutors?",
    answer:
      "Yes! The basic version is completely free for individual tutors, with optional premium features upcoming.",
  },
  {
    question: "Can students take exams without creating an account?",
    answer: "No, students cannot join exams without creating an account.",
  },
  {
    question: "Does it support the Bengali language?",
    answer:
      "Absolutely! You can create questions and answers in Bengali or English.",
  },
  {
    question: "How are results generated?",
    answer:
      "Results are calculated instantly after submission, and students can view their correct/incorrect answers.",
  },
];

export default function QnaSection() {
  return (
    <section className="py-16 ">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-10">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Accordion
              key={index}
              className="!bg-white/10 !ring-1 !ring-black/5 !backdrop-blur-3xl !shadow-lg"
            >
              <AccordionSummary
                expandIcon={
                  <HugeiconsIcon
                    icon={ArrowUp01FreeIcons}
                    className="w-5 h-5 text-green-700"
                  />
                }
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography component="span"> {faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
}
