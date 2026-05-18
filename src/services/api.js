import { getToken, removeToken } from "./authService";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const request = async (method, path, body) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 || response.status === 403) {
    removeToken();
    window.location.href = "/login";
    return;
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Erro ${response.status}`);
  }

  if (response.status === 204) return null;

  return response.json();
};

export { BASE_URL };
