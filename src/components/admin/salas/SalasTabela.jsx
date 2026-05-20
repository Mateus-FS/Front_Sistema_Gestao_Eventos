import { useConfirmacao } from "../../../hooks/ui/useConfirmacao";
import { useModalEdicao } from "../../../hooks/ui/useModalEdicao";
import { AlertaFeedback } from "../../AlertaFeedback";
import { SpinnerCentral } from "../../SpinnerCentral";
import { TabelaVazia } from "../../TabelaVazia";
import { BaseModal } from "../BaseModal";
import { ConfirmacaoModal } from "../ConfirmacaoModal";
import { SalaFormulario } from "./SalaFormulario";

export function SalasTabela({ dados }) {
  const {
    lista,
    carregando,
    salvando,
    erro,
    setErro,
    sucesso,
    setSucesso,
    salvar,
    deletar,
  } = dados;

  const modal = useModalEdicao();
  const confirmacao = useConfirmacao();

  const handleSalvar = async (dadosFormulario) => {
    const idEdicao = modal.estaEditando ? modal.itemAtual.id : null;
    const ok = await salvar(dadosFormulario, idEdicao);

    if (ok) modal.fechar();
  };

  const handleConfirmarExclusao = async () => {
    const ok = await deletar(confirmacao.id);

    if (ok) confirmacao.cancelar();
  };

  const chaveFormulario = modal.estaEditando
    ? `editar-${modal.itemAtual.id}`
    : "novo";

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
          <i className="bi bi-door-open me-2 text-primary" aria-hidden="true" />
          Gerenciar salas
        </h6>
        <button
          type="button"
          className="btn sge-btn-login btn-sm text-white"
          onClick={modal.abrirNovo}
          disabled={carregando || salvando}
        >
          <i className="bi bi-plus-lg me-1" aria-hidden="true" />
          Nova sala
        </button>
      </div>

      {carregando ? (
        <SpinnerCentral />
      ) : lista.length === 0 ? (
        <TabelaVazia icone="bi-door-closed" texto="Nenhuma sala cadastrada." />
      ) : (
        <div className="row g-3">
          {lista.map((sala) => (
            <div key={sala.id} className="col-md-4 col-sm-6">
              <div className="card sge-card border h-100">
                <div className="card-body">
                  <div className="d-flex align-items-start justify-content-between">
                    <div>
                      <div className="fw-bold text-body-emphasis">
                        {sala.nome}
                      </div>
                      <div className="text-body-secondary small mt-1">
                        <i className="bi bi-geo-alt me-1" aria-hidden="true" />
                        {sala.localizacao || "—"}
                      </div>
                    </div>
                    <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill ms-2">
                      <i className="bi bi-people me-1" aria-hidden="true" />
                      {sala.capacidade}
                    </span>
                  </div>
                </div>
                <div className="card-footer bg-transparent border-top d-flex gap-2 justify-content-end py-2">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => modal.abrirEdicao(sala)}
                    disabled={salvando}
                  >
                    <i className="bi bi-pencil me-1" aria-hidden="true" />
                    Editar
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    title="Excluir"
                    aria-label={`Excluir sala ${sala.nome}`}
                    onClick={() =>
                      confirmacao.confirmar(
                        sala.id,
                        `Tem certeza que deseja remover a sala "${sala.nome}"?`,
                      )
                    }
                    disabled={salvando}
                  >
                    <i className="bi bi-trash3" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal.estaAberto && (
        <BaseModal
          titulo={modal.estaEditando ? "Editar sala" : "Nova sala"}
          onFechar={modal.fechar}
        >
          <SalaFormulario
            key={chaveFormulario}
            valoresIniciais={modal.itemAtual}
            onSalvar={handleSalvar}
            onCancelar={modal.fechar}
            salvando={salvando}
          />
        </BaseModal>
      )}

      <ConfirmacaoModal
        aberto={confirmacao.aberto}
        titulo="Excluir sala"
        mensagem={confirmacao.mensagem}
        textoBotao="Excluir"
        onConfirmar={handleConfirmarExclusao}
        onCancelar={confirmacao.cancelar}
        carregando={salvando}
      />
    </>
  );
}