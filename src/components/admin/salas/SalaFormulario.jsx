import { useState } from "react";

export function SalaFormulario({
  inicial = {},
  onSalvar,
  onCancelar,
  carregando,
}) {
  const [form, setForm] = useState({
    nome: inicial.nome ?? "",
    localizacao: inicial.localizacao ?? "",
    capacidade: inicial.capacidade ?? "",
  });

  const set = (campo) => (e) =>
    setForm((f) => ({ ...f, [campo]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSalvar({ ...form, capacidade: Number(form.capacidade) });
  };

  return (
    <form onSubmit={handleSubmit} className="row g-3">
      <div className="col-12">
        <label className="form-label fw-semibold small">Nome *</label>
        <input
          className="form-control sge-input"
          value={form.nome}
          onChange={set("nome")}
          required
          placeholder="Ex: Auditório Principal"
        />
      </div>

      <div className="col-md-8">
        <label className="form-label fw-semibold small">Localização</label>
        <input
          className="form-control sge-input"
          value={form.localizacao}
          onChange={set("localizacao")}
          placeholder="Ex: Bloco A, 2º andar"
        />
      </div>

      <div className="col-md-4">
        <label className="form-label fw-semibold small">Capacidade *</label>
        <input
          type="number"
          min={1}
          className="form-control sge-input"
          value={form.capacidade}
          onChange={set("capacidade")}
          required
          placeholder="100"
        />
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
          {inicial.id ? "Salvar alterações" : "Criar sala"}
        </button>
      </div>
    </form>
  );
}
