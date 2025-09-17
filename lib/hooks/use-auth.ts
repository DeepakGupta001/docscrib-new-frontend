import { useState, useEffect } from "react";
import { authApi } from "@/lib/api";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Only check auth if the authentication cookie exists
    const cookies = document.cookie.split(';');
    const hasAuthCookie = cookies.some(cookie => cookie.trim().startsWith('connect.sid='));

    if (hasAuthCookie) {
      checkAuthStatus();
    } else {
      // No cookie, assume not authenticated
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userData = await authApi.getCurrentUser();
      setUser(userData.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      setIsAuthenticated(false);

      // If it's a 401/403 error, the session might be expired
      // Clear any stale cookies by attempting logout
      if (error instanceof Error && (
        error.message.includes("401") ||
        error.message.includes("403") ||
        error.message.includes("Unauthorized")
      )) {
        try {
          await authApi.logout();
        } catch {
          // Ignore logout errors during cleanup
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Call backend to invalidate session
      await authApi.logout();
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      // Clear local state
      setUser(null);
      setIsAuthenticated(false);
      // Delete authentication cookie completely
      if (typeof window !== "undefined") {
        const hostname = window.location.hostname;
        document.cookie = "connect.sid=; Max-Age=0; path=/; SameSite=Lax;";
        if (hostname !== "localhost") {
          document.cookie = "connect.sid=; Max-Age=0; path=/; domain=." + hostname + "; SameSite=Lax;";
        }
      }
      setIsLoading(false);
      // Optional: redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = "/login";
      }
    }
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    checkAuthStatus,
    logout,
  };
}
