import { useState, useEffect, useCallback } from "react";
import { authApi } from "@/lib/api";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  title?: string;
  specialization?: string;
  organisationName?: string;
  companySize?: string;
  country?: string;
  role?: string;
  picture?: string;
  // Add other user properties as needed
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true, // Start with true to show loading on initial mount
    user: null
  });

  const checkAuthStatus = useCallback(async (): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      const response = await authApi.getCurrentUser();
      // Handle different response structures
      const userData = response.user;

      setAuthState({
        user: userData,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error: any) {
      console.error("Auth check failed:", error);

      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });

      // If it's a 401/403 error, the session might be expired
      // Clear any stale cookies by attempting logout
      if (
        error instanceof Error &&
        (error.message.includes("401") ||
          error.message.includes("403") ||
          error.message.includes("Unauthorized"))
      ) {
        try {
          await authApi.logout();
        } catch {
          // Ignore logout errors during cleanup
        }
      }
    }
  }, []);

  // Check auth status on mount - removed cookie checking since it's HttpOnly
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      const response = await authApi.login(email, password);
      const userData = response.user || response;

      setAuthState({
        user: userData,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error: any) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false
      }));
      throw error; // Re-throw so components can handle the error
    }
  }, []);

  const register = useCallback(
    async (firstName: string, lastName: string, email: string, password: string): Promise<void> => {
      try {
        setAuthState((prev) => ({ ...prev, isLoading: true }));

        const response = await authApi.register(firstName, lastName, email, password);
        const userData = response.user || response;

        setAuthState({
          user: userData,
          isAuthenticated: true,
          isLoading: false
        });
      } catch (error: any) {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false
        }));
        throw error; // Re-throw so components can handle the error
      }
    },
    []
  );

  const logout = useCallback(async (): Promise<void> => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      // Call backend to invalidate session
      await authApi.logout();
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      // Clear local state
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });

      // Note: Don't try to delete HttpOnly cookies from client-side
      // The server should handle cookie deletion via res.clearCookie()

      // Optional: redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }, []);

  const updateUser = useCallback(
    async (data: {
      firstName?: string;
      lastName?: string;
      title?: string;
      specialization?: string;
      organisationName?: string;
      companySize?: string;
      country?: string;
      role?: string;
    }): Promise<void> => {
      try {
        setAuthState((prev) => ({ ...prev, isLoading: true }));

        const response = await authApi.updateCurrentUser(data);
        const updatedUser = response.user || response;

        setAuthState((prev) => ({
          ...prev,
          user: updatedUser,
          isLoading: false
        }));
      } catch (error: any) {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false
        }));
        throw error; // Re-throw so components can handle the error
      }
    },
    []
  );

  const googleCallback = useCallback(
    async (data: {
      googleId: string;
      email: string;
      name?: string;
      picture?: string;
      accessToken: string;
    }): Promise<void> => {
      try {
        setAuthState((prev) => ({ ...prev, isLoading: true }));

        const response = await authApi.googleCallback(data);
        const userData = response.user || response;

        setAuthState({
          user: userData,
          isAuthenticated: true,
          isLoading: false
        });
      } catch (error: any) {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false
        }));
        throw error; // Re-throw so components can handle the error
      }
    },
    []
  );

  const uploadProfileImage = useCallback(
    async (file: File): Promise<string> => {
      try {
        setAuthState((prev) => ({ ...prev, isLoading: true }));

        const formData = new FormData();
        formData.append('profileImage', file);

        const response = await authApi.uploadProfileImage(formData);
        const updatedUser = response.user || response;

        setAuthState((prev) => ({
          ...prev,
          user: updatedUser,
          isLoading: false
        }));

        return updatedUser.profileImageUrl || updatedUser.picture || '';
      } catch (error: any) {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false
        }));
        throw error; // Re-throw so components can handle the error
      }
    },
    []
  );

  return {
    // Destructure authState for easier access
    ...authState,
    // Auth methods
    login,
    register,
    logout,
    updateUser,
    uploadProfileImage,
    googleCallback,
    checkAuthStatus,
    // Helper methods
    refreshAuth: checkAuthStatus // Alias for manual auth refresh
  };
}
