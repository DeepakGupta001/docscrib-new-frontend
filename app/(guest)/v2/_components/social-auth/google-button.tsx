import Image from "next/image";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GoogleButtonProps extends React.ComponentProps<typeof Button> {
  loading?: boolean;
}

export function GoogleButton({ className, loading, ...props }: GoogleButtonProps) {
  return (
    <Button
      variant="outline"
      className={cn("flex w-full items-center justify-center gap-2", className)}
      {...props}>
      <Image
        src="https://www.svgrepo.com/show/355037/google.svg"
        alt="Google"
        width={16}
        height={16}
      />
      <span className="text-sm font-medium">
        {loading ? "Signing in..." : "Continue with Google"}
      </span>
    </Button>
  );
}
