import MainLayout from "@/components/main-layout";
import { ProtectedRoute } from "@/components/auth-guard";

export default function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <MainLayout>{children}</MainLayout>
    </ProtectedRoute>
  );
}
