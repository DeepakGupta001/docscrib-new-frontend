"use client";

import { useAuth } from "@/lib/hooks/use-auth";

export default function AuthStatus() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    return <div className="text-sm text-red-500">Not authenticated</div>;
  }

  return (
    <div className="text-sm text-green-600">
      Authenticated as: {user?.email || "User"}
    </div>
  );
}
