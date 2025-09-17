"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      toastOptions={{
        classNames: {
          toast: "bg-white text-gray-900 border border-gray-200 shadow-lg",
          description: "!text-black text-sm mt-1 [&]:!text-black",
          title: "text-gray-900 font-semibold text-base",
        },
      }}
      style={
        {
          "--normal-bg": "#ffffff",
          "--normal-text": "#000000",
          "--normal-border": "#e5e7eb",
          "--normal-description": "#000000",
          "--success-bg": "#ffffff",
          "--success-text": "#000000",
          "--success-description": "#000000",
          "--error-bg": "#ffffff",
          "--error-text": "#000000",
          "--error-description": "#000000",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }