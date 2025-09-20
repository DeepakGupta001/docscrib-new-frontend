import { handleApiError } from "./error-handler";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// Global flag to prevent multiple simultaneous token refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorMessage = `HTTP error! status: ${res.status}`;

    try {
      const errorData = await res
        .clone()
        .json()
        .catch(() => null);
      if (errorData && (errorData.message || errorData.error)) {
        errorMessage = errorData.message || errorData.error;
      } else {
        const errorText = await res.clone().text();
        if (errorText) {
          errorMessage = errorText;
        }
      }
    } catch {
      errorMessage = `Request failed with status ${res.status}`;
    }

    // For client errors like 400/401/403, throw error to trigger catch block in components
    if ([400, 401, 403].includes(res.status)) {
      throw new Error(errorMessage);
    }

    // For server errors (>=500), show toast and throw to break execution
    handleApiError(errorMessage);
    throw new Error(errorMessage);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  retryCount = 0
): Promise<Response> {
  const isFormData = data instanceof FormData;

  // Prepend base URL if the URL doesn't already include it
  const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;

  // Prepare headers
  const headers: Record<string, string> = {};

  // Add Content-Type for JSON data
  if (data && !isFormData) {
    headers["Content-Type"] = "application/json";
  }

  // Add Authorization header with JWT token for authenticated requests
  const accessToken = tokenManager.getAccessToken();
  if (accessToken && !tokenManager.isTokenExpired(accessToken)) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(fullUrl, {
    method,
    headers,
    body: isFormData ? data : data ? JSON.stringify(data) : undefined
  });

  // Handle 401 errors by attempting token refresh (only once)
  if (res.status === 401 && retryCount === 0) {
    try {
      // Prevent multiple simultaneous refresh attempts
      if (isRefreshing) {
        if (refreshPromise) {
          await refreshPromise;
        }
      } else {
        isRefreshing = true;
        refreshPromise = tokenManager.refreshAccessToken();
        await refreshPromise;
        isRefreshing = false;
        refreshPromise = null;
      }

      // Retry the original request with the new token
      return apiRequest(method, url, data, retryCount + 1);
    } catch (refreshError) {
      // If refresh fails, clear tokens and throw the original error
      tokenManager.clearTokens();
      throw new Error("Authentication failed. Please log in again.");
    }
  }

  await throwIfResNotOk(res);
  return res;
}

// JWT token management utilities
const TOKEN_KEY = "auth_tokens";

export const tokenManager = {
  setTokens(accessToken: string, refreshToken: string) {
    if (typeof window !== "undefined") {
      // Store in localStorage for client-side access
      localStorage.setItem(
        TOKEN_KEY,
        JSON.stringify({
          accessToken,
          refreshToken,
          timestamp: Date.now()
        })
      );

      // Also set HttpOnly cookies for server-side access (middleware)
      // Note: We can't set HttpOnly cookies from client-side JavaScript
      // This would need to be done server-side, but for now we'll use a different approach
      // The middleware will check both cookies and localStorage
    }
  },

  getTokens() {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(TOKEN_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  getAccessToken() {
    const tokens = this.getTokens();
    return tokens?.accessToken || null;
  },

  getRefreshToken() {
    const tokens = this.getTokens();
    return tokens?.refreshToken || null;
  },

  clearTokens() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  isTokenExpired(token: string) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  },

  async refreshAccessToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();
      if (data.success && data.data?.tokens) {
        this.setTokens(data.data.tokens.accessToken, data.data.tokens.refreshToken);
        return data.data.tokens.accessToken;
      } else {
        throw new Error("Invalid refresh response");
      }
    } catch (error) {
      // Clear tokens on refresh failure
      this.clearTokens();
      throw error;
    }
  }
};

// Authentication API functions
export const authApi = {
  async login(email: string, password: string) {
    const response = await apiRequest("POST", "/api/auth/login", {
      email,
      password
    });
    const data = await response.json();

    // Store JWT tokens if login successful
    if (data.success && data.data?.tokens) {
      tokenManager.setTokens(data.data.tokens.accessToken, data.data.tokens.refreshToken);
    }

    return data;
  },

  async register(email: string, password: string, firstName: string, lastName: string) {
    const response = await apiRequest("POST", "/api/auth/register", {
      email,
      password,
      first_name: firstName,
      last_name: lastName
    });
    const data = await response.json();

    // Store JWT tokens if registration successful
    if (data.success && data.data?.tokens) {
      tokenManager.setTokens(data.data.tokens.accessToken, data.data.tokens.refreshToken);
    }

    return data;
  },

  async getCurrentUser() {
    const response = await apiRequest("GET", "/api/auth/me");
    return response.json();
  },

  async logout() {
    const response = await apiRequest("POST", "/api/auth/logout", {
      refresh_token: tokenManager.getRefreshToken()
    });
    return response.json();
  },

  async googleCallback(data: {
    googleId: string;
    email: string;
    name?: string;
    picture?: string;
    accessToken: string;
  }) {
    const response = await apiRequest("POST", "/api/auth/google/callback", data);
    return response.json();
  },

  async uploadProfileImage(formData: FormData) {
    const response = await apiRequest("POST", "/api/auth/upload-profile-image", formData);
    return response.json();
  },

  async completeOnboarding(data: {
    specialization: string;
    organisation_name: string;
    company_size: string;
    role: string;
  }) {
    const response = await apiRequest("POST", "/api/auth/onboarding", data);
    return response.json();
  }
};

// Template Library API functions
export const templateApi = {
  // Get all templates with optional filtering and pagination
  async getTemplates(params?: {
    query?: string;
    type?: "note" | "document" | "pdf";
    visibility?: "only-me" | "team" | "community";
    isFavorite?: boolean;
    creator?: string;
    sortBy?: "name" | "type" | "uses" | "lastUsed" | "creator" | "createdAt" | "updatedAt";
    sortOrder?: "asc" | "desc";
    limit?: number;
    offset?: number;
    dateFrom?: string;
    dateTo?: string;
    minUses?: number;
    maxUses?: number;
    isDefault?: boolean;
    highlightContribution?: boolean;
  }) {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const url = `/api/templates${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    const response = await apiRequest("GET", url);
    return response.json();
  },

  // Get favorite templates
  async getFavoriteTemplates() {
    const response = await apiRequest("GET", "/api/templates/favorites");
    return response.json();
  },

  // Get specific template by ID
  async getTemplate(id: number) {
    const response = await apiRequest("GET", `/api/templates/${id}`);
    return response.json();
  },

  // Create a new template
  async createTemplate(data: {
    name: string;
    type: "note" | "document";
    content: string;
    visibility?: "only-me" | "team" | "community";
    isDefault?: boolean;
    highlightContribution?: boolean;
    metadata?: any;
  }) {
    const response = await apiRequest("POST", "/api/templates", data);
    return response.json();
  },

  // Upload PDF template
  async uploadPdfTemplate(formData: FormData) {
    const response = await apiRequest("POST", "/api/templates/pdf", formData);
    return response.json();
  },

  // Update template
  async updateTemplate(
    id: number,
    data: {
      name?: string;
      content?: string;
      visibility?: "only-me" | "team" | "community";
      isDefault?: boolean;
      metadata?: any;
    }
  ) {
    const response = await apiRequest("PUT", `/api/templates/${id}`, data);
    return response.json();
  },

  // Update template visibility
  async updateTemplateVisibility(
    id: number,
    data: {
      visibility: "only-me" | "team" | "community";
      highlightContribution?: boolean;
    }
  ) {
    const response = await apiRequest("PATCH", `/api/templates/${id}/visibility`, data);
    return response.json();
  },

  // Toggle template favorite status
  async toggleFavorite(id: number, isFavorite: boolean) {
    const response = await apiRequest("PATCH", `/api/templates/${id}/favorite`, { isFavorite });
    return response.json();
  },

  // Track template usage
  async trackUsage(id: number, context?: string, metadata?: any) {
    const response = await apiRequest("POST", `/api/templates/${id}/use`, {
      context,
      metadata
    });
    return response.json();
  },

  // Delete template
  async deleteTemplate(id: number) {
    const response = await apiRequest("DELETE", `/api/templates/${id}`);
    return response.json();
  },

  // Advanced search with statistics
  async advancedSearch(params?: {
    query?: string;
    type?: "note" | "document" | "pdf";
    visibility?: "only-me" | "team" | "community";
    isFavorite?: boolean;
    creator?: string;
    sortBy?: "name" | "type" | "uses" | "lastUsed" | "creator" | "createdAt" | "updatedAt";
    sortOrder?: "asc" | "desc";
    limit?: number;
    offset?: number;
    dateFrom?: string;
    dateTo?: string;
    minUses?: number;
    maxUses?: number;
    isDefault?: boolean;
    highlightContribution?: boolean;
    includeStats?: boolean;
  }) {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const url = `/api/templates/search/advanced${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    const response = await apiRequest("GET", url);
    return response.json();
  },

  // Get community templates
  async getCommunityTemplates(params?: {
    query?: string;
    type?: "note" | "document" | "pdf";
    creator?: string;
    limit?: number;
    offset?: number;
  }) {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const url = `/api/templates/community${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    const response = await apiRequest("GET", url);
    return response.json();
  },

  // Generate AI template
  async generateTemplate(data: { instructions: string; source?: "existing" | "blank" }) {
    const response = await apiRequest("POST", "/api/templates/generate", data);
    return response.json();
  }
};
