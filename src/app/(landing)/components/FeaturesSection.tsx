// src/components/FeaturesSection.tsx

import {
  BarChartIcon,
  Task01Icon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const features = [
  {
    icon: (
      <HugeiconsIcon icon={Task01Icon} className="w-10 h-10 text-green-700" />
    ),
    title: "Easy Exam Creation",
    desc: "Quickly create MCQ tests and share them with students.",
  },
  {
    icon: (
      <HugeiconsIcon
        icon={UserMultiple02Icon}
        className="w-10 h-10 text-green-700"
      />
    ),
    title: "Randomized Questions",
    desc: "Prevent cheating by randomizing question order for each student.",
  },
  {
    icon: (
      <HugeiconsIcon icon={BarChartIcon} className="w-10 h-10 text-green-700" />
    ),
    title: "Instant Results",
    desc: "Automatic grading with instant feedback for students.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 ">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-10">
          Platform Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-6 rounded-lg  shadow-2xl bg-white/10 ring-1 ring-black/5 backdrop-blur-3xl"
            >
              {f.icon}
              <h3 className="mt-4 font-semibold text-lg">{f.title}</h3>
              <p className="text-gray-600 mt-2">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
