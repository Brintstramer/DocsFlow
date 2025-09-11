import { tokenManager } from "./tokenManager";

export const createAuthHeaders = (): HeadersInit => {
  const token = tokenManager.getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};
