import { useState } from "react";

export function NotificacaoFormulario({
  usuarios = [],
  onEnviar,
  onCancelar,
  carregando,
}) {
  const [form, setForm] = useState({
    mensagem: "",
    destinatarioTodos: true,
    destinatarioId: "",
  });

  const set = (campo) => (e) =>
    setForm((f) => ({ ...f, [campo]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onEnviar({
      mensagem: form.mensagem,
      destinatario: form.destinatarioTodos ? "TODOS" : form.destinatarioId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="row g-3">
      <div className="col-12">
        <label className="form-label fw-semibold small">Mensagem *</label>
        <textarea
          className="form-control sge-input"
          rows={4}
          value={form.mensagem}
          onChange={set("mensagem")}
          required
          placeholder="Digite a mensagem da notificação..."
        />
      </div>

      <div className="col-12">
        <label className="form-label fw-semibold small">Destinatário</label>
        <div className="d-flex gap-3 mb-2">
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              id="dest-todos"
              checked={form.destinatarioTodos}
              onChange={() =>
                setForm((f) => ({
                  ...f,
                  destinatarioTodos: true,
                  destinatarioId: "",
                }))
              }
            />
            <label className="form-check-label small" htmlFor="dest-todos">
              <i className="bi bi-people me-1" />
              Todos os usuários
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              id="dest-especifico"
              checked={!form.destinatarioTodos}
              onChange={() =>
                setForm((f) => ({ ...f, destinatarioTodos: false }))
              }
            />
            <label className="form-check-label small" htmlFor="dest-especifico">
              <i className="bi bi-person me-1" />
              Usuário específico
            </label>
          </div>
        </div>

        {!form.destinatarioTodos && (
          <select
            className="form-select sge-input"
            value={form.destinatarioId}
            onChange={set("destinatarioId")}
            required
          >
            <option value="">Selecione o usuário...</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nome} — {u.email}
              </option>
            ))}
          </select>
        )}
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
            <i className="bi bi-send me-1" />
          )}
          Enviar notificação
        </button>
      </div>
    </form>
  );
}
