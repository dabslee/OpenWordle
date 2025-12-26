// src/api/api.ts
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";


export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // include cookies
});

// Attach auth token safely (client-side only)
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken");
    if (token) {
      // config.headers.Authorization = `Token ${token}`;
      config.headers.Authorization = `Bearer ${token}`;

    }
  }

  return config;
});
