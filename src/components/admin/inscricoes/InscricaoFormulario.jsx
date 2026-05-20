import { useState } from "react";

const criarEstadoInicial = () => ({
  usuarioId: "",
  eventoId: "",
});

export function InscricaoFormulario({
  usuarios = [],
  eventos = [],
  onSalvar,
  onCancelar,
  salvando = false,
}) {
  const [dados, setDados] = useState(() => criarEstadoInicial());

  const atualizarCampo = (campo) => (e) => {
    setDados((atual) => ({ ...atual, [campo]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSalvar({
      usuarioId: Number(dados.usuarioId),
      eventoId:  Number(dados.eventoId),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="row g-3" noValidate>
      <div className="col-12">
        <label htmlFor="inscricao-usuario" className="form-label fw-semibold small">
          Usuário *
        </label>
        <select
          id="inscricao-usuario"
          className="form-select sge-input"
          value={dados.usuarioId}
          onChange={atualizarCampo("usuarioId")}
          required
          disabled={salvando}
        >
          <option value="">Selecione um usuário...</option>
          {usuarios.map((u) => (
            <option key={u.id} value={String(u.id)}>
              {u.nome} — {u.email}
            </option>
          ))}
        </select>
      </div>

      <div className="col-12">
        <label htmlFor="inscricao-evento" className="form-label fw-semibold small">
          Evento *
        </label>
        <select
          id="inscricao-evento"
          className="form-select sge-input"
          value={dados.eventoId}
          onChange={atualizarCampo("eventoId")}
          required
          disabled={salvando}
        >
          <option value="">Selecione um evento...</option>
          {eventos.map((ev) => (
            <option key={ev.id} value={String(ev.id)}>
              {ev.titulo}
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
          disabled={salvando || !dados.usuarioId || !dados.eventoId}
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
          Criar inscrição
        </button>
      </div>
    </form>
  );
}