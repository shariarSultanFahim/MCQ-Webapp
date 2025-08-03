"use server";

export async function signup(formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Here you would typically send the data to your backend API
  // For demonstration, we will just log it and return a success response
  console.log({ name, phone, email, password });

  //   return { success: true, message: "Signup successful!" };
}
