"use server";

export async function login(formData: FormData) {
  "use server";

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Here you would typically send the data to your backend API
  // For demonstration, we will just log it and return a success response
  console.log({ email, password });

  //   return { success: true, message: "Signup successful!" };
}
