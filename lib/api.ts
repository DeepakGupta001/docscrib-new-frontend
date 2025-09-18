import { handleApiError } from "./error-handler";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

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
  data?: unknown | undefined
): Promise<Response> {
  const isFormData = data instanceof FormData;

  // Prepend base URL if the URL doesn't already include it
  const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;

  const res = await fetch(fullUrl, {
    method,
    headers: data && !isFormData ? { "Content-Type": "application/json" } : {},
    body: isFormData ? data : data ? JSON.stringify(data) : undefined,
    credentials: "include"
  });

  await throwIfResNotOk(res);
  return res;
}

// Authentication API functions
export const authApi = {
  async login(email: string, password: string) {
    const response = await apiRequest("POST", "/api/auth/login", {
      email,
      password
    });
    return response.json();
  },

  async register(firstName: string, lastName: string, email: string, password: string) {
    const response = await apiRequest("POST", "/api/auth/register", {
      firstName,
      lastName,
      email,
      password
    });
    return response.json();
  },

  async getCurrentUser() {
    const response = await apiRequest("GET", "/api/auth/me");
    return response.json();
  },

  async updateCurrentUser(data: {
    firstName?: string;
    lastName?: string;
    title?: string;
    specialization?: string;
    organisationName?: string;
    companySize?: string;
    country?: string;
    role?: string;
  }) {
    const response = await apiRequest("PUT", "/api/auth/me", data);
    return response.json();
  },

  async logout() {
    const response = await apiRequest("POST", "/api/auth/logout");
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
  }
};

// Template Library API functions
export const templateApi = {
  // Get all templates with optional filtering and pagination
  async getTemplates(params?: {
    query?: string;
    type?: 'note' | 'document' | 'pdf';
    visibility?: 'only-me' | 'team' | 'community';
    isFavorite?: boolean;
    creator?: string;
    sortBy?: 'name' | 'type' | 'uses' | 'lastUsed' | 'creator' | 'createdAt' | 'updatedAt';
    sortOrder?: 'asc' | 'desc';
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
    
    const url = `/api/templates${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
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
    type: 'note' | 'document';
    content: string;
    visibility?: 'only-me' | 'team' | 'community';
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
  async updateTemplate(id: number, data: {
    name?: string;
    content?: string;
    visibility?: 'only-me' | 'team' | 'community';
    isDefault?: boolean;
    metadata?: any;
  }) {
    const response = await apiRequest("PUT", `/api/templates/${id}`, data);
    return response.json();
  },

  // Update template visibility
  async updateTemplateVisibility(id: number, data: {
    visibility: 'only-me' | 'team' | 'community';
    highlightContribution?: boolean;
  }) {
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
    type?: 'note' | 'document' | 'pdf';
    visibility?: 'only-me' | 'team' | 'community';
    isFavorite?: boolean;
    creator?: string;
    sortBy?: 'name' | 'type' | 'uses' | 'lastUsed' | 'creator' | 'createdAt' | 'updatedAt';
    sortOrder?: 'asc' | 'desc';
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
    
    const url = `/api/templates/search/advanced${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await apiRequest("GET", url);
    return response.json();
  },

  // Get community templates
  async getCommunityTemplates(params?: {
    query?: string;
    type?: 'note' | 'document' | 'pdf';
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
    
    const url = `/api/templates/community${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await apiRequest("GET", url);
    return response.json();
  },

  // Generate AI template
  async generateTemplate(data: {
    instructions: string;
    source?: "existing" | "blank";
  }) {
    const response = await apiRequest("POST", "/api/templates/generate", data);
    return response.json();
  }
};
