import { QueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "../constants";
import type { ApiError } from "../types/apiTypes";
import { createAuthHeaders } from "../utils/createAuthHeaders";

// Создаем клиент для React Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 минут
      gcTime: 30 * 60 * 1000, // 30 минут
      retry: 1,
    },
  },
});

// Базовые функции HTTP запросов
export const http = {
  // GET запрос
  async get<T>(url: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: "GET",
      headers: createAuthHeaders(),
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: `HTTP error! status: ${response.status}`,
      }));
      throw new Error(error.message || "Network response was not ok");
    }

    return response.json();
  },

  // POST запрос
  async post<T>(url: string, data: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: "POST",
      headers: createAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: `HTTP error! status: ${response.status}`,
      }));
      throw new Error(error.message || "Network response was not ok");
    }

    return response.json();
  },

  // PUT запрос
  async put<T>(url: string, data: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: "PUT",
      headers: createAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: `HTTP error! status: ${response.status}`,
      }));
      throw new Error(error.message || "Network response was not ok");
    }

    return response.json();
  },

  // DELETE запрос
  async delete<T>(url: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: "DELETE",
      headers: createAuthHeaders(),
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: `HTTP error! status: ${response.status}`,
      }));
      throw new Error(error.message || "Network response was not ok");
    }

    return response.json();
  },
};
