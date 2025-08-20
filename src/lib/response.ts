import { error } from "console";

export default function formatResponse<T>(data: T) {
  return {
    success: true,
    data,
    message: "Operation successful.",
  };
}

interface ErrorResponse {
  success: false;
  message: string;
}

export function formatError(error: unknown): ErrorResponse {
  console.error(error);
  return {
    success: false,
    message: "An unexpected error occurred.",
  };
}
