import { request } from "./api";

export const salaService = {
  listar: (page = 0, size = 10) =>
    request("GET", `/api/sge/salas?page=${page}&size=${size}`),

  buscarPorId: (id) => request("GET", `/api/sge/salas/${id}`),

  salvar: (dados) => request("POST", "/api/sge/salas", dados),

  atualizar: (id, dados) => request("PUT", `/api/sge/salas/${id}`, dados),

  deletar: (id) => request("DELETE", `/api/sge/salas/${id}`),
};
