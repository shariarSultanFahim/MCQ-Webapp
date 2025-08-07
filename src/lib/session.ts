"use server";

import { cookies } from "next/headers";

interface UserSession {
  id: string;
  full_name: string;
  email: string;
}

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  return session ? JSON.parse(session.value) : null;
}
