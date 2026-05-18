import { request } from "./api";

export const perfilService = {
  listar: (page = 0, size = 10) =>
    request("GET", `/api/sge/perfis?page=${page}&size=${size}`),

  buscarPorId: (id) => request("GET", `/api/sge/perfis/${id}`),

  salvar: (dados) => request("POST", "/api/sge/perfis", dados),

  atualizar: (id, dados) => request("PUT", `/api/sge/perfis/${id}`, dados),

  deletar: (id) => request("DELETE", `/api/sge/perfis/${id}`),
};
