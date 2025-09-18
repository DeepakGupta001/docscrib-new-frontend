"use client";

import Sidebar from "./layout/sidebar";
import Header from "./layout/header";
import Footer from "./layout/footer";
import { cn } from "@/lib/utils";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-col h-screen w-full lg:ps-[--sidebar-width]">
          <Header />
          <main className={cn("flex-1")}>{children}</main>
          <Footer />
        </div>
      </div>
    </>
  );
}
