import { request } from "./api";

export const eventoService = {
  listar: (page = 0, size = 10) =>
    request("GET", `/api/sge/eventos?page=${page}&size=${size}`),

  buscarPorId: (id) => request("GET", `/api/sge/eventos/${id}`),

  salvar: (dados) => request("POST", "/api/sge/eventos", dados),

  atualizar: (id, dados) => request("PUT", `/api/sge/eventos/${id}`, dados),

  deletar: (id) => request("DELETE", `/api/sge/eventos/${id}`),
};
