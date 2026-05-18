import { useState } from "react";

export function UsuarioFormulario({
  inicial = {},
  perfisLista = [],
  onSalvar,
  onCancelar,
  carregando,
}) {
  const [form, setForm] = useState({
    funcao: inicial.funcao ?? "",
    perfis: inicial.perfis?.map((p) => p.id ?? p) ?? [],
  });

  const set = (campo) => (e) =>
    setForm((f) => ({ ...f, [campo]: e.target.value }));

  const togglePerfil = (id) => {
    setForm((f) => ({
      ...f,
      perfis: f.perfis.includes(id)
        ? f.perfis.filter((p) => p !== id)
        : [...f.perfis, id],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSalvar(form);
  };

  return (
    <form onSubmit={handleSubmit} className="row g-3">
      <div className="col-12">
        <p className="small text-body-secondary mb-2">
          <i className="bi bi-person me-1" />
          <strong>{inicial.nome}</strong> — {inicial.email}
        </p>
      </div>

      <div className="col-12">
        <label className="form-label fw-semibold small">Função</label>
        <select
          className="form-select sge-input"
          value={form.funcao}
          onChange={set("funcao")}
        >
          <option value="">Sem função</option>
          {["ALUNO", "PROFESSOR", "SERVIDOR"].map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {perfisLista.length > 0 && (
        <div className="col-12">
          <label className="form-label fw-semibold small">Perfis</label>
          <div className="d-flex flex-wrap gap-2">
            {perfisLista.map((p) => {
              const ativo = form.perfis.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => togglePerfil(p.id)}
                  className={`btn btn-sm ${ativo ? "btn-primary" : "btn-outline-secondary"}`}
                >
                  {ativo && <i className="bi bi-check me-1" />}
                  {p.nome}
                </button>
              );
            })}
          </div>
        </div>
      )}

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
          Salvar
        </button>
      </div>
    </form>
  );
}
