const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const setToken        = (token) => localStorage.setItem('sge_token', token);
export const getToken        = ()      => localStorage.getItem('sge_token');
export const removeToken     = ()      => localStorage.removeItem('sge_token');
export const isAuthenticated = ()      => !!getToken();

export const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

async function request(method, path, body) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });

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
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Erro ao realizar login');
    }
    console.log('Resposta do login:', response);
    return response.json();
  },
};

export const eventos = {
  listarEventos: (page = 0, size = 10) =>
    request('GET', `/api/sge/eventos?page=${page}&size=${size}`),

  buscarEventoPorId: (id) =>
    request('GET', `/api/sge/eventos/${id}`),

  salvarEvento: (dados) =>
    request('POST', '/api/sge/eventos', dados),

  atualizarEvento: (id, dados) =>
    request('PUT', `/api/sge/eventos/${id}`, dados),

  deletarEvento: (id) =>
    request('DELETE', `/api/sge/eventos/${id}`),
};

export const inscricoes = {
  listarInscricoes: (page = 0, size = 10) =>
    request('GET', `/api/sge/inscricoes?page=${page}&size=${size}`),

  buscarInscricaoPorId: (id) =>
    request('GET', `/api/sge/inscricoes/${id}`),

  salvarInscricao: (dados) =>
    request('POST', '/api/sge/inscricoes', dados),

  atualizarInscricao: (id, dados) =>
    request('PUT', `/api/sge/inscricoes/${id}`, dados),

  deletarInscricao: (id) =>
    request('DELETE', `/api/sge/inscricoes/${id}`),
};

export const notificacoes = {
  listarNotificacoes: (page = 0, size = 10) =>
    request('GET', `/api/sge/notificacoes?page=${page}&size=${size}`),

  buscarNotificacaoPorId: (id) =>
    request('GET', `/api/sge/notificacoes/${id}`),

  salvarNotificacao: (dados) =>
    request('POST', '/api/sge/notificacoes', dados),

  atualizarNotificacao: (id, dados) =>
    request('PUT', `/api/sge/notificacoes/${id}`, dados),

  deletarNotificacao: (id) =>
    request('DELETE', `/api/sge/notificacoes/${id}`),
};

export const perfis = {
  listarPerfis: (page = 0, size = 10) =>
    request('GET', `/api/sge/perfis?page=${page}&size=${size}`),

  buscarPerfisPorId: (id) =>
    request('GET', `/api/sge/perfis/${id}`),

  salvarPerfis: (dados) =>
    request('POST', '/api/sge/perfis', dados),

  atualizarPerfis: (id, dados) =>
    request('PUT', `/api/sge/perfis/${id}`, dados),

  deletarPerfis: (id) =>
    request('DELETE', `/api/sge/perfis/${id}`),
};

export const salas = {
  listarSalas: (page = 0, size = 10) =>
    request('GET', `/api/sge/salas?page=${page}&size=${size}`),

  buscarSalaPorId: (id) =>
    request('GET', `/api/sge/salas/${id}`),

  salvarSala: (dados) =>
    request('POST', '/api/sge/salas', dados),

  atualizarSala: (id, dados) =>
    request('PUT', `/api/sge/salas/${id}`, dados),

  deletarSala: (id) =>
    request('DELETE', `/api/sge/salas/${id}`),
};

export const usuarios = {
  listarUsuarios: (page = 0, size = 10) =>
    request('GET', `/api/sge/usuarios?page=${page}&size=${size}`),

  buscarUsuarioPorId: (id) =>
    request('GET', `/api/sge/usuarios/${id}`),

  salvarUsuario: (dados) =>
    request('POST', '/api/sge/usuarios', dados),

  atualizarUsuario: (id, dados) =>
    request('PUT', `/api/sge/usuarios/${id}`, dados),

  deletarUsuario: (id) =>
    request('DELETE', `/api/sge/usuarios/${id}`),
};