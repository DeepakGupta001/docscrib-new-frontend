import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
} from "lucide-react"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:mt-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground border-border",
        destructive:
          "text-destructive border-destructive/50 bg-destructive/10 [&>svg]:text-destructive",
        success:
          "text-green-600 border-green-600/50 bg-green-100 [&>svg]:text-green-600",
        warning:
          "text-yellow-700 border-yellow-700/50 bg-yellow-100 [&>svg]:text-yellow-700",
        info: "text-blue-700 border-blue-700/50 bg-blue-100 [&>svg]:text-blue-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const variantIcons: Record<string, React.ReactNode> = {
  default: <Info />,
  destructive: <AlertCircle />,
  success: <CheckCircle2 />,
  warning: <TriangleAlert />,
  info: <Info />,
}

interface AlertProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof alertVariants> {
  icon?: React.ReactNode
}

function Alert({ className, variant = "default", icon, children, ...props }: AlertProps) {
  const Icon = icon ?? variantIcons[variant ?? "default"]

  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {Icon && <span className="col-start-1 row-span-2 row-start-1">{Icon}</span>}
      {children}
    </div>
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }