import { getSession } from "@/lib/session";
import { redirect, RedirectType } from "next/navigation";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSession();

  if (user) {
    // If user exists, redirect to dashboard
    redirect("/dashboard", RedirectType.replace);
  }

  return children;
}
