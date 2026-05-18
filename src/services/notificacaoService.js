import { request } from "./api";

export const notificacaoService = {
  listar: (page = 0, size = 10) =>
    request("GET", `/api/sge/notificacoes?page=${page}&size=${size}`),

  buscarPorId: (id) => request("GET", `/api/sge/notificacoes/${id}`),

  salvar: (dados) => request("POST", "/api/sge/notificacoes", dados),

  atualizar: (id, dados) =>
    request("PUT", `/api/sge/notificacoes/${id}`, dados),

  deletar: (id) => request("DELETE", `/api/sge/notificacoes/${id}`),
};
