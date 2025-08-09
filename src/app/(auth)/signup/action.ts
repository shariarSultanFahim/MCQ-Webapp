"use server";

import bcrypt from "bcrypt";
import { Prisma, PrismaClient } from "@prisma/client";
import { redirect, RedirectType } from "next/navigation";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import formatResponse, { formatError } from "@/lib/response";

const prisma = new PrismaClient();

export async function signup(formData: FormData) {
  "use server";

  const full_name = formData.get("full_name") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const user = await prisma.user.create({
      data: {
        full_name,
        phone,
        email,
        password: await bcrypt.hash(password, 10), // Hash the password
      },
    });
    return formatResponse(user);
  } catch (error: unknown) {
    return formatError(error);
  }
  // redirect("/login", RedirectType.replace); // Redirect to login page after successful signup
}
