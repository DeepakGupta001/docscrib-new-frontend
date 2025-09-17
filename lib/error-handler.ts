import { toast } from "react-hot-toast";

/**
 * Centralized error handler for API errors
 * Displays toast notifications for user-friendly error messages
 */
export function handleApiError(error: unknown) {
  let message = "An unexpected error occurred";

  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  }

  toast.error(message, {
    duration: 4000,
    position: "top-right",
  });
}
