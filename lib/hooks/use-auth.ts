import { useState, useEffect, useCallback } from "react";
import { authApi, tokenManager } from "@/lib/api";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  title?: string;
  specialization?: string;
  license_number?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  subscription_status: string;
  trial_ends_at?: string | null;
  subscription_ends_at?: string | null;
  google_id?: string | null;
  profile_image_url?: string | null;
  auth_provider: string;
  organisation_name?: string;
  company_size?: string;
  country?: string;
  role: string;
  // Legacy fields for backward compatibility
  firstName?: string;
  lastName?: string;
  organisationName?: string;
  picture?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
}

// Helper functions to manage user data in localStorage
const USER_STORAGE_KEY = 'auth_user_data';

const storeUserData = (user: User): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }
};

const getUserData = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userData = localStorage.getItem(USER_STORAGE_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Failed to parse user data from localStorage:', error);
    return null;
  }
};

const clearUserData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
};

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null
  });

  const checkAuthStatus = useCallback(async (): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      // Check if we have valid tokens in localStorage
      const accessToken = tokenManager.getAccessToken();
      if (accessToken && !tokenManager.isTokenExpired(accessToken)) {
        // We have valid tokens, get user data from localStorage
        const storedUser = getUserData();
        
        setAuthState({
          user: storedUser,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        // No valid tokens
        clearUserData(); // Clean up stale user data
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    } catch (error: any) {
      console.error("Auth check failed:", error);

      // Clear both tokens and user data on error
      tokenManager.clearTokens();
      clearUserData();

      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  }, []); // Remove dependency on authState.user

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = useCallback(async (response: any): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      // Handle new API response structure
      if (response.success && response.data?.user) {
        // Transform API response to match component expectations
        const apiUser = response.data.user;
        const transformedUser: User = {
          ...apiUser,
          // Add camelCase versions for backward compatibility
          firstName: apiUser.first_name,
          lastName: apiUser.last_name,
          organisationName: apiUser.organisation_name,
          picture: apiUser.profile_image_url
        };

        console.log("Transformed User:", transformedUser);

        // Store user data in localStorage
        storeUserData(transformedUser);

        setAuthState({
          user: transformedUser,
          isAuthenticated: true,
          isLoading: false
        });

      } else {
        // Fallback for old response structure
        const userData = response.user || response;
        
        // Store user data in localStorage
        storeUserData(userData);
        
        setAuthState({
          user: userData,
          isAuthenticated: true,
          isLoading: false
        });
      }
    } catch (error: any) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false
      }));
      throw error;
    }
  }, []);

  const register = useCallback(async (response: any): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      // Handle new API response structure
      if (response.success && response.data?.user) {
        // Transform API response to match component expectations
        const apiUser = response.data.user;
        const transformedUser: User = {
          ...apiUser,
          // Add camelCase versions for backward compatibility
          firstName: apiUser.first_name,
          lastName: apiUser.last_name,
          organisationName: apiUser.organisation_name,
          picture: apiUser.profile_image_url
        };

        // Store user data in localStorage
        storeUserData(transformedUser);

        setAuthState({
          user: transformedUser,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        // Fallback for old response structure
        const userData = response.user || response;
        
        // Store user data in localStorage
        storeUserData(userData);
        
        setAuthState({
          user: userData,
          isAuthenticated: true,
          isLoading: false
        });
      }
    } catch (error: any) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false
      }));
      throw error;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      // Call backend to invalidate session
      await authApi.logout();
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      // Clear JWT tokens and user data
      tokenManager.clearTokens();
      clearUserData();

      // Clear local state
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });

      // Optional: redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }, []);

  const updateUser = useCallback(async (response: any): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      // Handle new API response structure
      if (response.success && response.data?.user) {
        // Transform API response to match component expectations
        const apiUser = response.data.user;
        const transformedUser: User = {
          ...apiUser,
          // Add camelCase versions for backward compatibility
          firstName: apiUser.first_name,
          lastName: apiUser.last_name,
          organisationName: apiUser.organisation_name,
          picture: apiUser.profile_image_url
        };

        // Update stored user data
        storeUserData(transformedUser);

        setAuthState((prev) => ({
          ...prev,
          user: transformedUser,
          isLoading: false
        }));
      } else {
        // Fallback for old response structure
        const userData = response.user || response;
        
        // Update stored user data
        storeUserData(userData);
        
        setAuthState((prev) => ({
          ...prev,
          user: userData,
          isLoading: false
        }));
      }
    } catch (error: any) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false
      }));
      throw error;
    }
  }, []);

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

        // Store user data in localStorage
        storeUserData(userData);

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
        throw error;
      }
    },
    []
  );

  const uploadProfileImage = useCallback(async (file: File): Promise<string> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await authApi.uploadProfileImage(formData);
      const apiUser = response.user || response;

      // Transform API response to match component expectations
      const transformedUser: User = {
        ...apiUser,
        // Add camelCase versions for backward compatibility
        firstName: apiUser.first_name,
        lastName: apiUser.last_name,
        organisationName: apiUser.organisation_name,
        picture: apiUser.profile_image_url
      };

      // Update stored user data
      storeUserData(transformedUser);

      setAuthState((prev) => ({
        ...prev,
        user: transformedUser,
        isLoading: false
      }));

      return transformedUser.profile_image_url || transformedUser.picture || "";
    } catch (error: any) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false
      }));
      throw error;
    }
  }, []);

  const completeOnboarding = useCallback(
    async (data: {
      specialization: string;
      license_number: string;
      organisation_name: string;
      company_size: string;
      country: string;
      role: string;
    }): Promise<void> => {
      try {
        setAuthState((prev) => ({ ...prev, isLoading: true }));

        const response = await authApi.completeOnboarding(data);

        // Handle new API response structure
        if (response.success && response.data?.user) {
          // Transform API response to match component expectations
          const apiUser = response.data.user;
          const transformedUser: User = {
            ...apiUser,
            // Add camelCase versions for backward compatibility
            firstName: apiUser.first_name,
            lastName: apiUser.last_name,
            organisationName: apiUser.organisation_name,
            picture: apiUser.profile_image_url
          };

          // Store updated user data
          storeUserData(transformedUser);

          setAuthState((prev) => ({
            ...prev,
            user: transformedUser,
            isLoading: false
          }));
        } else {
          // Fallback for old response structure
          const updatedUser = response.user || response;
          
          // Store updated user data
          storeUserData(updatedUser);
          
          setAuthState((prev) => ({
            ...prev,
            user: updatedUser,
            isLoading: false
          }));
        }
      } catch (error: any) {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false
        }));
        throw error;
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
    completeOnboarding,
    checkAuthStatus,
    // Helper methods
    refreshAuth: checkAuthStatus // Alias for manual auth refresh
  };
}