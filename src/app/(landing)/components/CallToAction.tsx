// src/components/CallToAction.tsx
import { Button } from "@mui/material";

export default function CallToAction() {
  return (
    <section className="py-16  text-center">
      <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
      <p className="mb-6">
        Sign up today and make exam management simple and effective.
      </p>
      <Button
        variant="outlined"
        href="/signup"
        className=" !rounded-xl !font-semibold !text-lg !bg-[#274032] !text-white !backdrop-blur-3xl"
      >
        Create Account
      </Button>
    </section>
  );
}
