import { useState } from "react";
import { AlertaFeedback } from "../../AlertaFeedback";
import { ConfirmacaoModal } from "../ConfirmacaoModal";
import { SpinnerCentral } from "../../SpinnerCentral";
import { TabelaVazia } from "../../TabelaVazia";

export function Perfis({ dados }) {
  const {
    sucesso,
    erro,
    setSucesso,
    setErro,
    carregando,
    lista,
    salvar,
    deletar,
  } = dados;

  const [novoPerfil, setNovoPerfil] = useState("");
  const [confirmacao, setConfirmacao] = useState(null);
  const [salvando, setSalvando] = useState(false);

  const handleSalvar = async (e) => {
    e.preventDefault();
    if (!novoPerfil.trim()) return;
    setSalvando(true);
    const ok = await salvar({ nome: novoPerfil.trim().toUpperCase() });
    setSalvando(false);
    if (ok) setNovoPerfil("");
  };

  const handleDeletar = async () => {
    setSalvando(true);
    await deletar(confirmacao.item.id);
    setSalvando(false);
    setConfirmacao(null);
  };

  return (
    <>
      <AlertaFeedback
        sucesso={sucesso}
        erro={erro}
        onFecharSucesso={() => setSucesso("")}
        onFecharErro={() => setErro("")}
      />

      <div className="d-flex align-items-center justify-content-between mb-3">
        <h6 className="fw-bold text-body-emphasis mb-0">
          <i className="bi bi-shield-check me-2 text-primary" />
          Perfis e permissões
        </h6>
      </div>

      <form
        onSubmit={handleSalvar}
        className="d-flex gap-2 mb-4"
        style={{ maxWidth: 360 }}
      >
        <input
          className="form-control form-control-sm sge-input"
          placeholder="Nome do novo perfil (ex: MODERADOR)"
          value={novoPerfil}
          onChange={(e) => setNovoPerfil(e.target.value)}
        />
        <button
          type="submit"
          className="btn sge-btn-login btn-sm text-white flex-shrink-0"
          disabled={salvando || !novoPerfil.trim()}
        >
          {salvando ? (
            <span className="spinner-border spinner-border-sm" />
          ) : (
            <i className="bi bi-plus-lg" />
          )}
        </button>
      </form>

      {carregando ? (
        <SpinnerCentral />
      ) : lista.length === 0 ? (
        <TabelaVazia icone="bi-shield-x" texto="Nenhum perfil cadastrado." />
      ) : (
        <div className="d-flex flex-wrap gap-2">
          {lista.map((p) => (
            <div
              key={p.id}
              className="d-flex align-items-center gap-2 px-3 py-2 border rounded-pill bg-white"
              style={{ fontSize: "0.85rem" }}
            >
              <i className="bi bi-shield-fill-check text-primary" />
              <span className="fw-semibold">{p.nome}</span>
              <button
                className="btn btn-link btn-sm p-0 text-danger ms-1"
                style={{ lineHeight: 1 }}
                onClick={() => setConfirmacao({ item: p })}
              >
                <i className="bi bi-x-lg" style={{ fontSize: "0.7rem" }} />
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmacaoModal
        aberto={!!confirmacao}
        titulo="Deletar perfil"
        mensagem={`Tem certeza que deseja remover o perfil "${confirmacao?.item?.nome}"?`}
        textoBotao="Deletar"
        onConfirmar={handleDeletar}
        onCancelar={() => setConfirmacao(null)}
        carregando={salvando}
      />
    </>
  );
}
