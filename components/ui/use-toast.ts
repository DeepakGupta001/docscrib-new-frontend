"use client"

import { toast as sonnerToast } from "sonner"

interface ToastOptions {
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

// Export the shadcn-compatible toast functions that wrap sonner
export const toast = {
  success: (message: string, options?: ToastOptions) => {
    return sonnerToast.success(message, {
      description: options?.description,
      duration: options?.duration,
      action: options?.action,
      classNames: {
        description: "!text-black text-sm mt-1",
        title: "text-gray-900 font-semibold text-base",
      },
      style: {
        '--description-color': '#000000',
      } as React.CSSProperties,
    })
  },
  error: (message: string, options?: ToastOptions) => {
    return sonnerToast.error(message, {
      description: options?.description,
      duration: options?.duration,
      action: options?.action,
      classNames: {
        description: "text-black text-sm mt-1",
        title: "text-gray-900 font-semibold text-base",
      },
    })
  },
  info: (message: string, options?: ToastOptions) => {
    return sonnerToast.info(message, {
      description: options?.description,
      duration: options?.duration,
      action: options?.action,
      classNames: {
        description: "text-black text-sm mt-1",
        title: "text-gray-900 font-semibold text-base",
      },
    })
  },
  warning: (message: string, options?: ToastOptions) => {
    return sonnerToast.warning(message, {
      description: options?.description,
      duration: options?.duration,
      action: options?.action,
      classNames: {
        description: "text-black text-sm mt-1",
        title: "text-gray-900 font-semibold text-base",
      },
    })
  },
  // Add a default toast method
  default: (message: string, options?: ToastOptions) => {
    return sonnerToast(message, {
      description: options?.description,
      duration: options?.duration,
      action: options?.action,
      classNames: {
        description: "text-black text-sm mt-1",
        title: "text-gray-900 font-semibold text-base",
      },
    })
  },
}

// Export useToast for compatibility (though we're primarily using the toast object)
export const useToast = () => {
  return {
    toast,
    dismiss: (toastId?: string) => sonnerToast.dismiss(toastId),
  }
}