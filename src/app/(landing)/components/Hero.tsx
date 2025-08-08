// src/components/HeroSection.tsx
import { Button } from "@mui/material";
export default function HeroSection() {
  return (
    <section className="flex flex-col items-center text-center py-16 ">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Conduct Online MCQ Exams Easily
      </h1>
      <p className="text-gray-600 max-w-xl mb-6">
        Create, share, and grade MCQ exams instantly — perfect for private
        tutors in Bangladesh.
      </p>
      <Button
        variant="outlined"
        href="/signup"
        className=" !rounded-xl !font-semibold !text-lg !bg-[#274032] !text-white !backdrop-blur-3xl"
      >
        Get Started
      </Button>
    </section>
  );
}
