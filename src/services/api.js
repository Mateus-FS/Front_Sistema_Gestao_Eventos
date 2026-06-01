import axios from "axios";
import { toast } from "sonner";
import { authStorage } from "../utils/authStorage";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = authStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const MENSAGENS = {
  401: "Sessão expirada",
  403: "Usuário sem permissão",
  500: "Erro interno",
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      toast.error("Não foi possível conectar ao servidor");
      return Promise.reject(error);
    }

    const status = error.response.status;

    if (status === 401) {
      if (error.config?.url?.includes("/auth/")) {
        return Promise.reject(error);
      }
      authStorage.remove();
      toast.error("Sessão expirada");
      window.dispatchEvent(new Event("auth:expirado"));
      return Promise.reject(error);
    }

    if (status === 404 || status === 409) {
      return Promise.reject(error);
    }

    const mensagemPadrao = MENSAGENS[status];
    if (mensagemPadrao) {
      toast.error(mensagemPadrao);
    }

    return Promise.reject(error);
  }
);

export const request = (method, url, data, params) =>
  api({ method, url, data, params }).then((response) => response.data ?? null);

export default api;