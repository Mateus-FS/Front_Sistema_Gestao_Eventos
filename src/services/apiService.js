const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const setToken = (token) => localStorage.setItem("sge_token", token);
export const getToken = () => localStorage.getItem("sge_token");
export const removeToken = () => localStorage.removeItem("sge_token");

export const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

async function request(method, path, body) {
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
}

export const auth = {
  async login(email, senha) {
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
};

export const eventos = {
  listar: (page = 0, size = 10) =>
    request("GET", `/api/sge/eventos?page=${page}&size=${size}`),

  buscarPorId: (id) => request("GET", `/api/sge/eventos/${id}`),

  salvar: (dados) => request("POST", "/api/sge/eventos", dados),

  atualizar: (id, dados) => request("PUT", `/api/sge/eventos/${id}`, dados),

  deletar: (id) => request("DELETE", `/api/sge/eventos/${id}`),
};

export const inscricoes = {
  listar: (page = 0, size = 10) =>
    request("GET", `/api/sge/inscricoes?page=${page}&size=${size}`),

  listarPorUsuario: (usuarioId, page = 0, size = 10) =>
    request(
      "GET",
      `/api/sge/inscricoes/usuario/${usuarioId}?page=${page}&size=${size}`,
    ),

  buscarPorId: (id) => request("GET", `/api/sge/inscricoes/${id}`),

  salvar: (dados) => request("POST", "/api/sge/inscricoes", dados),

  atualizar: (id, dados) => request("PUT", `/api/sge/inscricoes/${id}`, dados),

  deletar: (id) => request("DELETE", `/api/sge/inscricoes/${id}`),
};

export const notificacoes = {
  listar: (page = 0, size = 10) =>
    request("GET", `/api/sge/notificacoes?page=${page}&size=${size}`),

  buscarPorId: (id) => request("GET", `/api/sge/notificacoes/${id}`),

  salvar: (dados) => request("POST", "/api/sge/notificacoes", dados),

  atualizar: (id, dados) =>
    request("PUT", `/api/sge/notificacoes/${id}`, dados),

  deletar: (id) => request("DELETE", `/api/sge/notificacoes/${id}`),
};

export const perfis = {
  listar: (page = 0, size = 10) =>
    request("GET", `/api/sge/perfis?page=${page}&size=${size}`),

  buscarPorId: (id) => request("GET", `/api/sge/perfis/${id}`),

  salvar: (dados) => request("POST", "/api/sge/perfis", dados),

  atualizar: (id, dados) => request("PUT", `/api/sge/perfis/${id}`, dados),

  deletar: (id) => request("DELETE", `/api/sge/perfis/${id}`),
};

export const salas = {
  listar: (page = 0, size = 10) =>
    request("GET", `/api/sge/salas?page=${page}&size=${size}`),

  buscarPorId: (id) => request("GET", `/api/sge/salas/${id}`),

  salvar: (dados) => request("POST", "/api/sge/salas", dados),

  atualizar: (id, dados) => request("PUT", `/api/sge/salas/${id}`, dados),

  deletar: (id) => request("DELETE", `/api/sge/salas/${id}`),
};

export const usuarios = {
  listar: (page = 0, size = 10) =>
    request("GET", `/api/sge/usuarios?page=${page}&size=${size}`),

  buscarPorId: (id) => request("GET", `/api/sge/usuarios/${id}`),

  salvar: (dados) => request("POST", "/api/sge/usuarios", dados),

  atualizar: (id, dados) => request("PUT", `/api/sge/usuarios/${id}`, dados),

  deletar: (id) => request("DELETE", `/api/sge/usuarios/${id}`),
};
