// src/components/Header.tsx
import { getSession } from "@/lib/session";
import { Avatar, Button } from "@mui/material";

export default async function Header() {
  const user = await getSession();
  return (
    <header className="flex items-center justify-between px-6 py-4 sticky top-0 z-50">
      <Avatar src="/logo.svg" alt="Examina" variant="rounded"></Avatar>

      {user ? (
        <Button
          variant="outlined"
          href="/dashboard"
          className="!bg-[#274032] !text-white !rounded-xl !font-semibold !shadow-lg"
        >
          Dashboard
        </Button>
      ) : (
        <Button
          variant="outlined"
          href="/login"
          className="!bg-[#274032] !text-white !rounded-xl !font-semibold !shadow-lg"
        >
          Log In
        </Button>
      )}
    </header>
  );
}
