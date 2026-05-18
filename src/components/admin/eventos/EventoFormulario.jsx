import { useState } from "react";

export function EventoFormulario({
  inicial = {},
  salas = [],
  organizadores = [],
  onSalvar,
  onCancelar,
  carregando,
}) {
  const hoje = new Date().toISOString().slice(0, 16);

  const [form, setForm] = useState({
    titulo: inicial.titulo ?? "",
    descricao: inicial.descricao ?? "",
    tipoEvento: inicial.tipoEvento ?? "",
    dataInicio: inicial.dataInicio ?? "",
    dataTermino: inicial.dataTermino ?? "",
    salaId: inicial.salaId ?? inicial.sala?.id ?? "",
    organizadorId: inicial.organizadorId ?? inicial.organizador?.id ?? "",
  });

  const set = (campo) => (e) =>
    setForm((f) => ({ ...f, [campo]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSalvar(form);
  };

  return (
    <form onSubmit={handleSubmit} className="row g-3">
      <div className="col-12">
        <label className="form-label fw-semibold small">Título *</label>
        <input
          className="form-control sge-input"
          value={form.titulo}
          onChange={set("titulo")}
          required
          placeholder="Nome do evento"
        />
      </div>

      <div className="col-12">
        <label className="form-label fw-semibold small">Descrição</label>
        <textarea
          className="form-control sge-input"
          rows={3}
          value={form.descricao}
          onChange={set("descricao")}
          placeholder="Descrição do evento"
        />
      </div>

      <div className="col-md-4">
        <label className="form-label fw-semibold small">Tipo *</label>
        <select
          className="form-select sge-input"
          value={form.tipoEvento}
          onChange={set("tipoEvento")}
          required
        >
          <option value="">Selecione...</option>
          {["CURSO","PALESTRA", "WORKSHOP"].map(
            (t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ),
          )}
        </select>
      </div>

      <div className="col-md-4">
        <label className="form-label fw-semibold small">Início *</label>
        <input
          type="datetime-local"
          className="form-control sge-input"
          value={form.dataInicio}
          onChange={set("dataInicio")}
          required
          min={hoje}
        />
      </div>

      <div className="col-md-4">
        <label className="form-label fw-semibold small">Término *</label>
        <input
          type="datetime-local"
          className="form-control sge-input"
          value={form.dataTermino}
          onChange={set("dataTermino")}
          required
          min={form.dataInicio || hoje}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label fw-semibold small">Sala</label>
        <select
          className="form-select sge-input"
          value={form.salaId}
          onChange={set("salaId")}
        >
          <option value="">Sem sala definida</option>
          {salas.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nome} ({s.capacidade} lugares)
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-6">
        <label className="form-label fw-semibold small">Organizador</label>
        <select
          className="form-select sge-input"
          value={form.organizadorId}
          onChange={set("organizadorId")}
        >
          <option value="">Selecione...</option>
          {organizadores.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="col-12 d-flex gap-2 justify-content-end pt-2">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={onCancelar}
          disabled={carregando}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn sge-btn-login btn-sm text-white"
          disabled={carregando}
        >
          {carregando ? (
            <span className="spinner-border spinner-border-sm me-1" />
          ) : (
            <i className="bi bi-check-lg me-1" />
          )}
          {inicial.id ? "Salvar alterações" : "Criar evento"}
        </button>
      </div>
    </form>
  );
}
