const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorMessage = `HTTP error! status: ${res.status}`;

    try {
      const errorText = await res.text();
      if (errorText) {
        // Try to parse as JSON first
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorText;
        } catch {
          // If not JSON, use the text directly
          errorMessage = errorText;
        }
      }
    } catch {
      // If we can't read the response, use the status
      errorMessage = `Request failed with status ${res.status}`;
    }

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
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

// Authentication API functions
export const authApi = {
  async login(email: string, password: string) {
    const response = await apiRequest("POST", "/api/auth/login", {
      email,
      password,
    });
    return response.json();
  },

  async register(firstName: string, lastName: string, email: string, password: string) {
    const response = await apiRequest("POST", "/api/auth/register", {
      firstName,
      lastName,
      email,
      password,
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
};
