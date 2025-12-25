// src/api/authApi.ts
import { api } from "./api";
import { AuthResponse, User } from "./types";

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

export const login = async (
  username: string,
  password: string
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/api/auth/login/", {
    username,
    password,
  });

  localStorage.setItem("authToken", data.token);
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post("/api/auth/logout/");
  localStorage.removeItem("authToken");
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data } = await api.get<{ is_authenticated: boolean; user: User }>(
    "/api/auth/user/"
  );

  return data.is_authenticated ? data.user : null;
};
