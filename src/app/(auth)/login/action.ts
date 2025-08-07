"use server";

import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { redirect, RedirectType } from "next/navigation";

const prisma = new PrismaClient();

export async function login(formData: FormData) {
  "use server";

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  // Set user session
  const cookieStore = await cookies();

  cookieStore.set(
    // Set a cookie with user information
    "session",
    JSON.stringify({
      id: user.id,
      full_name: user.full_name,
      email: user.email,
    }),
    {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    }
  );

  // Redirect
  redirect("/dashboard", RedirectType.replace);
}
