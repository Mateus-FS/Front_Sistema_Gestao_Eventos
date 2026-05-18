import { useState } from "react";
import { useConfirmacao } from "../../../hooks/ui/useConfirmacao";
import { useModalEdicao } from "../../../hooks/ui/useModalEdicao";
import { formatarData } from "../../../utils/formatacoes";
import { AlertaFeedback } from "../../AlertaFeedback";
import { SpinnerCentral } from "../../SpinnerCentral";
import { TabelaVazia } from "../../TabelaVazia";
import { BaseModal } from "../BaseModal";
import { ConfirmacaoModal } from "../ConfirmacaoModal";
import { NotificacaoFormulario } from "./NotificacaoFormulario";

export function NotificacoesTabela({ dados }) {
  const {
    sucesso,
    erro,
    setSucesso,
    setErro,
    carregando,
    lista,
    enviar,
    deletar,
    usuarios,
  } = dados;

  const [salvando, setSalvando] = useState(false);
  const modal = useModalEdicao();
  const confirmacao = useConfirmacao();

  const handleEnviar = async (formData) => {
    setSalvando(true);
    const ok = await enviar(formData);
    setSalvando(false);
    if (ok) modal.fechar();
  };

  const handleDeletar = async () => {
    await deletar(confirmacao.id);
    confirmacao.cancelar();
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
          <i className="bi bi-bell me-2 text-primary" />
          Notificações enviadas
        </h6>
        <button
          className="btn sge-btn-login btn-sm text-white"
          onClick={modal.abrirNovo}
        >
          <i className="bi bi-send me-1" /> Nova notificação
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
          {lista.map((n) => (
            <div key={n.id} className="card border sge-notif-card">
              <div className="card-body py-3 px-4 d-flex align-items-start gap-3">
                <div className="sge-notif-icon flex-shrink-0">
                  <i className="bi bi-bell-fill" />
                </div>
                <div className="flex-grow-1">
                  <p className="mb-1 small fw-semibold text-body-emphasis">
                    {n.mensagem}
                  </p>
                  <div
                    className="d-flex flex-wrap gap-3 text-body-secondary"
                    style={{ fontSize: "0.75rem" }}
                  >
                    <span>
                      <i className="bi bi-person me-1" />
                      {n.destinatario === "TODOS"
                        ? "Todos"
                        : (n.destinatario?.nome ?? n.destinatario)}
                    </span>
                    <span>
                      <i className="bi bi-clock me-1" />
                      {formatarData(n.dataEnvio)}
                    </span>
                  </div>
                </div>
                <button
                  className="btn btn-outline-danger btn-sm flex-shrink-0"
                  onClick={() =>
                    confirmacao.confirmar(
                      n.id,
                      "Tem certeza que deseja remover esta notificação?",
                    )
                  }
                >
                  <i className="bi bi-trash3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal.estaAberto && (
        <BaseModal titulo="Nova notificação" onFechar={modal.fechar}>
          <NotificacaoFormulario
            usuarios={usuarios}
            onEnviar={handleEnviar}
            onCancelar={modal.fechar}
            carregando={salvando}
          />
        </BaseModal>
      )}

      <ConfirmacaoModal
        aberto={confirmacao.aberto}
        titulo="Remover notificação"
        mensagem={confirmacao.mensagem}
        textoBotao="Remover"
        onConfirmar={handleDeletar}
        onCancelar={confirmacao.cancelar}
        carregando={salvando}
      />
    </>
  );
}
