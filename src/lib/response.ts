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

export function loginError(message: string): ErrorResponse {
  return {
    success: false,
    message,
  };
}
