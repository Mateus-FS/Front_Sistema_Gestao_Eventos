import { useState } from "react";
import { useConfirmacao } from "../../../hooks/ui/useConfirmacao";
import { useModalEdicao } from "../../../hooks/ui/useModalEdicao";
import { formatarData, formatarDestinatario } from "../../../utils/formatacoes";
import SpinnerCentral from "../../shared/SpinnerCentral";
import TabelaVazia from "../../shared/TabelaVazia";
import BaseModal from "../BaseModal";
import ConfirmacaoModal from "../ConfirmacaoModal";
import NotificacaoForm from "./NotificacaoForm";

const ITENS_POR_PAGINA = 10;

export default function NotificacoesTabela({ dados }) {
  const { lista, usuarios, carregando, salvando, enviar, deletar, deletarVarios } = dados;

  const [filtroDestinatario, setFiltroDestinatario] = useState("");
  const [selecionados, setSelecionados] = useState([]);
  const [confirmandoLote, setConfirmandoLote] = useState(false);
  const [pagina, setPagina] = useState(1);

  const modal = useModalEdicao();
  const confirmacao = useConfirmacao();

  const listaFiltrada = lista.filter((n) => {
    if (!filtroDestinatario) return true;
    if (filtroDestinatario === "__todos__") return !n.usuarioId;
    return String(n.usuarioId) === filtroDestinatario;
  });

  const totalPaginas = Math.ceil(listaFiltrada.length / ITENS_POR_PAGINA);
  const listaFiltradaPaginada = listaFiltrada.slice(
    (pagina - 1) * ITENS_POR_PAGINA,
    pagina * ITENS_POR_PAGINA
  );

  const todosSelecionados =
    listaFiltradaPaginada.length > 0 &&
    listaFiltradaPaginada.every((n) => selecionados.includes(n.id));

  const toggleSelecionado = (id) =>
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );

  const toggleTodos = () =>
    setSelecionados(todosSelecionados ? [] : listaFiltradaPaginada.map((n) => n.id));

  const handleFiltroDestinatario = (e) => {
    setFiltroDestinatario(e.target.value);
    setPagina(1);
  };

  const handleEnviar = async (dadosFormulario) => {
    await enviar(dadosFormulario);
    modal.fechar();
  };

  const handleConfirmarExclusao = async () => {
    await deletar(confirmacao.id);
    confirmacao.cancelar();
  };

  const handleExcluirLote = async () => {
    await deletarVarios(selecionados);
    setSelecionados([]);
    setConfirmandoLote(false);
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <h6 className="fw-bold text-body-emphasis mb-0">
          <i className="bi bi-bell me-2 text-primary" aria-hidden="true" />
          Notificações enviadas
        </h6>
        <div className="d-flex gap-2 flex-wrap align-items-center">
          <select
            className="form-select form-select-sm sge-input"
            style={{ width: "auto", minWidth: 180 }}
            value={filtroDestinatario}
            onChange={handleFiltroDestinatario}
            disabled={carregando || salvando}
            aria-label="Filtrar por destinatário"
          >
            <option value="">Todos os destinatários</option>
            {usuarios.map((u) => (
              <option key={u.id} value={String(u.id)}>
                {u.nome}
              </option>
            ))}
          </select>

          {selecionados.length > 0 && (
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() => setConfirmandoLote(true)}
              disabled={salvando}
            >
              <i className="bi bi-trash3 me-1" aria-hidden="true" />
              Excluir {selecionados.length} selecionada(s)
            </button>
          )}

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
      </div>

      {carregando ? (
        <SpinnerCentral />
      ) : listaFiltrada.length === 0 ? (
        <TabelaVazia
          icone="bi-bell-slash"
          texto={
            filtroDestinatario
              ? "Nenhuma notificação encontrada para esse destinatário."
              : "Nenhuma notificação enviada."
          }
        />
      ) : (
        <>
          <div className="d-flex align-items-center gap-2 mb-2 ps-1">
            <input
              type="checkbox"
              className="form-check-input"
              id="selecionar-todos"
              checked={todosSelecionados}
              onChange={toggleTodos}
            />
            <label
              htmlFor="selecionar-todos"
              className="form-check-label small text-body-secondary"
              style={{ cursor: "pointer" }}
            >
              Selecionar todos
            </label>
          </div>

          <div className="d-flex flex-column gap-2">
            {listaFiltradaPaginada.map((notificacao) => {
              const marcado = selecionados.includes(notificacao.id);
              return (
                <div
                  key={notificacao.id}
                  className={`card border sge-notif-card ${marcado ? "border-primary" : ""}`}
                  style={{ transition: "border-color 0.15s" }}
                >
                  <div className="card-body py-3 px-4 d-flex align-items-start gap-3">
                    <input
                      type="checkbox"
                      className="form-check-input flex-shrink-0 mt-1"
                      checked={marcado}
                      onChange={() => toggleSelecionado(notificacao.id)}
                      aria-label={`Selecionar notificação: ${notificacao.mensagem}`}
                    />
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
                          "Tem certeza que deseja remover esta notificação?"
                        )
                      }
                      disabled={salvando}
                    >
                      <i className="bi bi-trash3" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3 pe-1">
            <span className="badge bg-primary bg-opacity-10 text-primary">
              {listaFiltrada.length} notificação(ões)
            </span>

            {totalPaginas > 1 && (
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setPagina((p) => p - 1)}
                  disabled={pagina === 1}
                >
                  <i className="bi bi-chevron-left" />
                </button>
                <span className="small text-body-secondary">
                  {pagina} / {totalPaginas}
                </span>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setPagina((p) => p + 1)}
                  disabled={pagina === totalPaginas}
                >
                  <i className="bi bi-chevron-right" />
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {modal.estaAberto && (
        <BaseModal titulo="Nova notificação" onFechar={modal.fechar}>
          <NotificacaoForm
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

      <ConfirmacaoModal
        aberto={confirmandoLote}
        titulo="Excluir selecionadas"
        mensagem={`Tem certeza que deseja remover ${selecionados.length} notificação(ões)?`}
        textoBotao="Excluir"
        onConfirmar={handleExcluirLote}
        onCancelar={() => setConfirmandoLote(false)}
        carregando={salvando}
      />
    </>
  );
}