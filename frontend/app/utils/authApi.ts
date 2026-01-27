// src/api/authApi.ts
import { api } from "./api";
import { AuthResponse, User } from "./types";

// utils/cookies.ts
export function getCookie(name: string): string | null {
  const cookieString = document.cookie; // e.g., "csrftoken=abc; sessionid=123"
  const cookies = cookieString.split("; ").map(c => c.split("="));
  for (const [key, value] of cookies) {
    if (key === name) return decodeURIComponent(value);
  }
  return null;
}

export const signup = async (
  username: string,
  password: string,
  email: string
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/api/auth/signup/", {
    username,
    password,
    email,
  });

  localStorage.setItem("authToken", data.token);
  return data;
};


export const loginHelper = async (username: string, password: string) => {
  const csrftoken = getCookie("csrftoken");

  try {
    const response = await api.post(
      "/accounts/login/?next=/",
      new URLSearchParams({ username, password }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-CSRFToken": csrftoken || "",
        },
        withCredentials: true,
        validateStatus: (status) => true, // allow all statuses, we'll handle manually
      }
    );

    // Django usually returns 200 even on failed login with a form error,
    // but if using DRF or JSON login, it may return 400 or 401
    if (response.status === 200) {
      // Success: you might want to check if user is actually logged in
      return { success: true, data: response.data };
    } else {
      // Failed login
      return {
        success: false,
        status: response.status,
        message:
          response.data?.error || response.data?.non_field_errors?.[0] || "Invalid credentials",
      };
    }
  } catch (err: any) {
    // Network or unexpected error
    return { success: false, message: err.message || "Unknown error" };
  }
};

export const logout = async (): Promise<void> => {
  await api.post("/api/auth/logout/");
  localStorage.removeItem("authToken");
};

export const getCurrentUser = async (): Promise<User | null> => {
  const csrftoken = getCookie("csrftoken");

  try {
    const { data } = await api.get<{ is_authenticated: boolean; user: User }>(
      "/api/auth/user/",
      {
        headers: {
          "X-CSRFToken": csrftoken || "",
        },
        withCredentials: true,
      }
    );
    return data.is_authenticated ? data.user : null;
  } catch (err) {
    console.error("getCurrentUser failed:", err);
    return null; // treat failure as unauthenticated
  }
};
