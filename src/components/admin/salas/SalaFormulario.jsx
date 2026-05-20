import { useState } from "react";

const criarEstadoInicial = (sala = {}) => ({
  nome: sala.nome ?? "",
  localizacao: sala.localizacao ?? "",
  capacidade: sala.capacidade != null ? String(sala.capacidade) : "",
});

export function SalaFormulario({
  valoresIniciais = {},
  onSalvar,
  onCancelar,
  salvando = false,
}) {
  const modoEdicao = Boolean(valoresIniciais.id);

  const [dados, setDados] = useState(() => criarEstadoInicial(valoresIniciais));

  const atualizarCampo = (campo) => (evento) => {
    setDados((atual) => ({ ...atual, [campo]: evento.target.value }));
  };

  const handleSubmit = (evento) => {
    evento.preventDefault();

    onSalvar({
      nome: dados.nome.trim(),
      localizacao: dados.localizacao.trim(),
      capacidade: Number(dados.capacidade),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="row g-3" noValidate>
      <div className="col-12">
        <label htmlFor="sala-nome" className="form-label fw-semibold small">
          Nome *
        </label>
        <input
          id="sala-nome"
          className="form-control sge-input"
          value={dados.nome}
          onChange={atualizarCampo("nome")}
          required
          disabled={salvando}
          placeholder="Ex: Auditório Principal"
        />
      </div>

      <div className="col-md-8">
        <label htmlFor="sala-localizacao" className="form-label fw-semibold small">
          Localização
        </label>
        <input
          id="sala-localizacao"
          className="form-control sge-input"
          value={dados.localizacao}
          onChange={atualizarCampo("localizacao")}
          disabled={salvando}
          placeholder="Ex: Bloco A, 2º andar"
        />
      </div>

      <div className="col-md-4">
        <label htmlFor="sala-capacidade" className="form-label fw-semibold small">
          Capacidade *
        </label>
        <input
          id="sala-capacidade"
          type="number"
          min={1}
          className="form-control sge-input"
          value={dados.capacidade}
          onChange={atualizarCampo("capacidade")}
          required
          disabled={salvando}
          placeholder="100"
        />
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
          {modoEdicao ? "Salvar alterações" : "Criar sala"}
        </button>
      </div>
    </form>
  );
}