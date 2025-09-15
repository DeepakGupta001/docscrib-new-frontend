import { ReactNode } from "react";
import { Stethoscope } from "lucide-react"; // better than Command for medical theme

import { Separator } from "@/components/ui/separator";
import { APP_CONFIG } from "@/config/app-config";

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main className="bg-white">
      <div className="grid h-dvh justify-center p-2 lg:grid-cols-2">
        {/* Left Side (Brand / Info Section) */}
        <div className="relative order-2 hidden h-full rounded-3xl lg:flex bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700">
          <div className="absolute top-10 space-y-1 px-10 text-white">
            <Stethoscope className="size-10" />
            <h1 className="text-2xl font-semibold">{APP_CONFIG.name}</h1>
            <p className="text-sm opacity-90">AI-Powered Medical Documentation</p>
          </div>

          <div className="absolute bottom-10 flex w-full justify-between px-10 text-white">
            <div className="flex-1 space-y-1">
              <h2 className="font-medium">For Healthcare Providers</h2>
              <p className="text-sm opacity-90">
                Save hours every week by letting Docscrib generate accurate clinical notes in seconds.
              </p>
            </div>
            <Separator orientation="vertical" className="mx-3 !h-auto bg-white/40" />
            <div className="flex-1 space-y-1">
              <h2 className="font-medium">Need help?</h2>
              <p className="text-sm opacity-90">
                Visit our{" "}
                <a
                  href="https://docscrib.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-medium"
                >
                  docs
                </a>{" "}
                or contact support—our team is always ready to assist.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side (Children / Auth / Content) */}
        <div className="relative order-1 flex h-full">{children}</div>
      </div>
    </main>
  );
}
