import { useState } from "react";
import { paraInputDatetimeLocal } from "../../../utils/formatacoes";

const TIPOS_EVENTO = ["CURSO", "PALESTRA", "WORKSHOP"];

const criarEstadoInicial = (evento = {}) => ({
  titulo: evento.titulo ?? "",
  descricao: evento.descricao ?? "",
  tipoEvento: evento.tipoEvento ?? "",
  dataInicio: paraInputDatetimeLocal(evento.dataInicio),
  dataTermino: paraInputDatetimeLocal(evento.dataTermino),
  salaId: String(evento.salaId ?? evento.sala?.id ?? ""),
  organizadorId: String(evento.organizadorId ?? evento.organizador?.id ?? ""),
});

export function EventoFormulario({
  valoresIniciais = {},
  salas = [],
  organizadores = [],
  onSalvar,
  onCancelar,
  salvando = false,
}) {
  const dataMinima = new Date().toISOString().slice(0, 16);
  const modoEdicao = Boolean(valoresIniciais.id);

  const [dados, setDados] = useState(() => criarEstadoInicial(valoresIniciais));

  const atualizarCampo = (campo) => (evento) => {
    setDados((atual) => ({ ...atual, [campo]: evento.target.value }));
  };

  const handleSubmit = (evento) => {
    evento.preventDefault();

    onSalvar({
      titulo: dados.titulo.trim(),
      descricao: dados.descricao.trim(),
      tipoEvento: dados.tipoEvento,
      dataInicio: dados.dataInicio,
      dataTermino: dados.dataTermino,
      salaId: dados.salaId ? Number(dados.salaId) : null,
      organizadorId: dados.organizadorId ? Number(dados.organizadorId) : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="row g-3" noValidate>
      <div className="col-12">
        <label htmlFor="evento-titulo" className="form-label fw-semibold small">
          Título *
        </label>
        <input
          id="evento-titulo"
          className="form-control sge-input"
          value={dados.titulo}
          onChange={atualizarCampo("titulo")}
          required
          disabled={salvando}
          placeholder="Nome do evento"
        />
      </div>

      <div className="col-12">
        <label htmlFor="evento-descricao" className="form-label fw-semibold small">
          Descrição
        </label>
        <textarea
          id="evento-descricao"
          className="form-control sge-input"
          rows={3}
          value={dados.descricao}
          onChange={atualizarCampo("descricao")}
          disabled={salvando}
          placeholder="Descrição do evento"
        />
      </div>

      <div className="col-md-4">
        <label htmlFor="evento-tipo" className="form-label fw-semibold small">
          Tipo *
        </label>
        <select
          id="evento-tipo"
          className="form-select sge-input"
          value={dados.tipoEvento}
          onChange={atualizarCampo("tipoEvento")}
          required
          disabled={salvando}
        >
          <option value="">Selecione...</option>
          {TIPOS_EVENTO.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-4">
        <label htmlFor="evento-inicio" className="form-label fw-semibold small">
          Início *
        </label>
        <input
          id="evento-inicio"
          type="datetime-local"
          className="form-control sge-input"
          value={dados.dataInicio}
          onChange={atualizarCampo("dataInicio")}
          required
          disabled={salvando}
          min={modoEdicao ? undefined : dataMinima}
        />
      </div>

      <div className="col-md-4">
        <label htmlFor="evento-termino" className="form-label fw-semibold small">
          Término *
        </label>
        <input
          id="evento-termino"
          type="datetime-local"
          className="form-control sge-input"
          value={dados.dataTermino}
          onChange={atualizarCampo("dataTermino")}
          required
          disabled={salvando}
          min={dados.dataInicio || dataMinima}
        />
      </div>

      <div className="col-md-6">
        <label htmlFor="evento-sala" className="form-label fw-semibold small">
          Sala
        </label>
        <select
          id="evento-sala"
          className="form-select sge-input"
          value={dados.salaId}
          onChange={atualizarCampo("salaId")}
          disabled={salvando}
        >
          <option value="">Sem sala definida</option>
          {salas.map((sala) => (
            <option key={sala.id} value={String(sala.id)}>
              {sala.nome} ({sala.capacidade} lugares)
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-6">
        <label
          htmlFor="evento-organizador"
          className="form-label fw-semibold small"
        >
          Organizador
        </label>
        <select
          id="evento-organizador"
          className="form-select sge-input"
          value={dados.organizadorId}
          onChange={atualizarCampo("organizadorId")}
          disabled={salvando}
        >
          <option value="">Selecione...</option>
          {organizadores.map((usuario) => (
            <option key={usuario.id} value={String(usuario.id)}>
              {usuario.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="col-12 d-flex gap-2 justify-content-end pt-2">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={onCancelar}
          disabled={salvando}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn sge-btn-login btn-sm text-white"
          disabled={salvando}
        >
          {salvando ? (
            <span
              className="spinner-border spinner-border-sm me-1"
              role="status"
              aria-hidden="true"
            />
          ) : (
            <i className="bi bi-check-lg me-1" aria-hidden="true" />
          )}
          {modoEdicao ? "Salvar alterações" : "Criar evento"}
        </button>
      </div>
    </form>
  );
}