import Image from "next/image";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function GoogleButton({ className, ...props }: React.ComponentProps<typeof Button>) {
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
      <span className="text-sm font-medium">Continue with Google</span>
    </Button>
  );
}
