import { useConfirmacao } from "../../../hooks/ui/useConfirmacao";
import { useModalEdicao } from "../../../hooks/ui/useModalEdicao";
import { formatarData } from "../../../utils/formatacoes";
import { AlertaFeedback } from "../../AlertaFeedback";
import { SpinnerCentral } from "../../SpinnerCentral";
import { TabelaVazia } from "../../TabelaVazia";
import { BaseModal } from "../BaseModal";
import { ConfirmacaoModal } from "../ConfirmacaoModal";
import { NotificacaoFormulario } from "./NotificacaoFormulario";

const formatarDestinatario = (notificacao) => {
  if (notificacao.destinatario === "TODOS") return "Todos";

  return notificacao.destinatario?.nome ?? notificacao.destinatario ?? "—";
};

export function NotificacoesTabela({ dados }) {
  const {
    lista,
    usuarios,
    carregando,
    salvando,
    erro,
    setErro,
    sucesso,
    setSucesso,
    enviar,
    deletar,
  } = dados;

  const modal = useModalEdicao();
  const confirmacao = useConfirmacao();

  const handleEnviar = async (dadosFormulario) => {
    const ok = await enviar(dadosFormulario);

    if (ok) modal.fechar();
  };

  const handleConfirmarExclusao = async () => {
    const ok = await deletar(confirmacao.id);

    if (ok) confirmacao.cancelar();
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
          <i className="bi bi-bell me-2 text-primary" aria-hidden="true" />
          Notificações enviadas
        </h6>
        <button
          type="button"
          className="btn sge-btn-login btn-sm text-white"
          onClick={modal.abrirNovo}
          disabled={carregando || salvando}
        >
          <i className="bi bi-send me-1" aria-hidden="true" />
          Nova notificação
        </button>
      </div>

      {carregando ? (
        <SpinnerCentral />
      ) : lista.length === 0 ? (
        <TabelaVazia
          icone="bi-bell-slash"
          texto="Nenhuma notificação enviada."
        />
      ) : (
        <div className="d-flex flex-column gap-2">
          {lista.map((notificacao) => (
            <div key={notificacao.id} className="card border sge-notif-card">
              <div className="card-body py-3 px-4 d-flex align-items-start gap-3">
                <div className="sge-notif-icon flex-shrink-0">
                  <i className="bi bi-bell-fill" aria-hidden="true" />
                </div>
                <div className="flex-grow-1">
                  <p className="mb-1 small fw-semibold text-body-emphasis">
                    {notificacao.mensagem}
                  </p>
                  <div
                    className="d-flex flex-wrap gap-3 text-body-secondary"
                    style={{ fontSize: "0.75rem" }}
                  >
                    <span>
                      <i className="bi bi-person me-1" aria-hidden="true" />
                      {formatarDestinatario(notificacao)}
                    </span>
                    <span>
                      <i className="bi bi-clock me-1" aria-hidden="true" />
                      {formatarData(notificacao.dataEnvio)}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm flex-shrink-0"
                  title="Excluir"
                  aria-label="Excluir notificação"
                  onClick={() =>
                    confirmacao.confirmar(
                      notificacao.id,
                      "Tem certeza que deseja remover esta notificação?",
                    )
                  }
                  disabled={salvando}
                >
                  <i className="bi bi-trash3" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal.estaAberto && (
        <BaseModal titulo="Nova notificação" onFechar={modal.fechar}>
          <NotificacaoFormulario
            key="nova-notificacao"
            usuarios={usuarios}
            onEnviar={handleEnviar}
            onCancelar={modal.fechar}
            salvando={salvando}
          />
        </BaseModal>
      )}

      <ConfirmacaoModal
        aberto={confirmacao.aberto}
        titulo="Excluir notificação"
        mensagem={confirmacao.mensagem}
        textoBotao="Excluir"
        onConfirmar={handleConfirmarExclusao}
        onCancelar={confirmacao.cancelar}
        carregando={salvando}
      />
    </>
  );
}