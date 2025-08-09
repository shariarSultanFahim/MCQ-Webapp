export default function formatResponse(data: any) {
  return {
    success: true,
    data,
    message: "Operation successful.",
  };
}

export function formatError(_error: any) {
  return {
    success: false,
    message: "An unexpected error occurred.",
  };
}
