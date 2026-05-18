import { request } from "./api";

export const inscricaoService = {
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
