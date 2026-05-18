import { BASE_URL } from "./api";

const TOKEN_KEY = "sge_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const authService = {
  login: async (email, senha) => {
    const response = await fetch(`${BASE_URL}/api/sge/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Erro ao realizar login");
    }
    return response.json();
  },

  solicitarRecuperacao: async (email) => {
    const response = await fetch(`${BASE_URL}/api/sge/auth/recuperar-senha`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Erro ao solicitar recuperação de senha");
    }
    // Backend pode retornar 200 sem corpo
    if (response.status === 204) return null;
    return response.json().catch(() => null);
  },

  redefinirSenha: async (token, novaSenha) => {
    const response = await fetch(`${BASE_URL}/api/sge/auth/redefinir-senha`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, novaSenha }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Erro ao redefinir senha");
    }
    if (response.status === 204) return null;
    return response.json().catch(() => null);
  },
};