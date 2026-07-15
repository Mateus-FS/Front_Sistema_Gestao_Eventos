import { useState } from "react";
import { useConfirmacao } from "../../../hooks/ui/useConfirmacao";
import { useModalEdicao } from "../../../hooks/ui/useModalEdicao";
import { formatarData } from "../../../utils/formatacoes";
import SpinnerCentral from "../../shared/SpinnerCentral";
import TabelaVazia from "../../shared/TabelaVazia";
import BaseModal from "../BaseModal";
import ConfirmacaoModal from "../ConfirmacaoModal";
import InscricaoForm from "./InscricaoForm";

const CLASSE_STATUS = {
  CONFIRMADA: "sge-badge-confirmada",
  CANCELADA: "sge-badge-cancelada",
  PENDENTE: "sge-badge-pendente",
};

const classeStatus = (status) => CLASSE_STATUS[status] ?? "sge-badge-pendente";

const ITENS_POR_PAGINA = 5;

export default function InscricoesTabela({ dados, eventos = [], usuarios = [] }) {
  const {
    lista,
    listaTotal,
    filtroEvento,
    setFiltroEvento,
    filtroUsuario,
    setFiltroUsuario,
    carregando,
    salvando,
    salvar,
    confirmar,
    cancelar,
    marcarPresenca,
  } = dados;

  const modal = useModalEdicao();
  const confirmacao = useConfirmacao();
  const [tipoAcao, setTipoAcao] = useState(null);
  const [pagina, setPagina] = useState(1);

  const totalPaginas = Math.ceil(lista.length / ITENS_POR_PAGINA);
  const listaPaginada = lista.slice(
    (pagina - 1) * ITENS_POR_PAGINA,
    pagina * ITENS_POR_PAGINA
  );

  const handleFiltroEvento = (e) => {
    setFiltroEvento(e.target.value);
    setPagina(1);
  };

  const handleFiltroUsuario = (e) => {
    setFiltroUsuario(e.target.value);
    setPagina(1);
  };

  const handleSalvar = async (dadosFormulario) => {
    await salvar(dadosFormulario);
    modal.fechar();
  };

  const limparConfirmacao = () => {
    confirmacao.cancelar();
    setTipoAcao(null);
  };

  const abrirConfirmacao = (tipo, inscricao) => {
    setTipoAcao(tipo);
    const mensagem =
      tipo === "confirmar"
        ? `Confirmar inscrição de "${inscricao.usuarioNome}"?`
        : `Excluir inscrição de "${inscricao.usuarioNome}"?`;
    confirmacao.confirmar(inscricao.id, mensagem);
  };

  const handleConfirmarAcao = async () => {
    if (tipoAcao === "confirmar") {
      await confirmar(confirmacao.id);
    } else {
      await cancelar(confirmacao.id);
    }
    limparConfirmacao();
  };

  const handleAlternarPresenca = (inscricao) => {
    marcarPresenca(inscricao.id, !inscricao.presente);
  };
  
  const tituloModal =
    tipoAcao === "confirmar" ? "Confirmar inscrição" : "Excluir inscrição";
  const textoBotaoModal = tipoAcao === "confirmar" ? "Confirmar" : "Excluir";
  const varianteModal = tipoAcao === "confirmar" ? "success" : "danger";

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <h6 className="fw-bold text-body-emphasis mb-0">
          <i
            className="bi bi-bookmark-check me-2 text-primary"
            aria-hidden="true"
          />
          Gerenciar inscrições
        </h6>
        <div className="d-flex gap-2 flex-wrap align-items-center">
          <select
            className="form-select form-select-sm sge-input"
            style={{ width: "auto", minWidth: 180 }}
            value={filtroEvento}
            onChange={handleFiltroEvento}
            disabled={carregando || salvando}
            aria-label="Filtrar por evento"
          >
            <option value="">Todos os eventos</option>
            {eventos.map((ev) => (
              <option key={ev.id} value={String(ev.id)}>
                {ev.titulo}
              </option>
            ))}
          </select>
          <input
            type="search"
            className="form-control form-control-sm sge-input"
            style={{ width: 180 }}
            placeholder="Buscar usuário..."
            value={filtroUsuario}
            onChange={handleFiltroUsuario}
            disabled={carregando || salvando}
            aria-label="Buscar usuário"
          />
          <button
            type="button"
            className="btn sge-btn-login btn-sm text-white"
            onClick={modal.abrirNovo}
            disabled={carregando || salvando}
          >
            <i className="bi bi-plus-lg me-1" aria-hidden="true" />
            Nova inscrição
          </button>
        </div>
      </div>

      {carregando ? (
        <SpinnerCentral />
      ) : lista.length === 0 ? (
        <TabelaVazia
          icone="bi-bookmark-x"
          texto="Nenhuma inscrição encontrada."
        />
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle small">
            <thead className="table-light">
              <tr>
                <th scope="col">Usuário</th>
                <th scope="col">Evento</th>
                <th scope="col">Status</th>
                <th scope="col">Presente</th>
                <th scope="col">Data</th>
                <th scope="col" className="text-end">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {listaPaginada.map((inscricao) => (
                <tr key={inscricao.id}>
                  <td className="fw-semibold">{inscricao.usuarioNome}</td>
                  <td className="text-body-secondary">
                    {inscricao.eventoNome}
                  </td>
                  <td>
                    <span
                      className={`sge-badge-status ${classeStatus(inscricao.status)}`}
                    >
                      {inscricao.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`btn btn-sm ${inscricao.presente ? "btn-success" : "btn-outline-secondary"}`}
                      aria-label={
                        inscricao.presente
                          ? `Desmarcar presença de ${inscricao.usuarioNome}`
                          : `Marcar presença de ${inscricao.usuarioNome}`
                      }
                      onClick={() => handleAlternarPresenca(inscricao)}
                      disabled={salvando}
                      style={{ minWidth: 34, padding: "2px 8px" }}
                    >
                      <i
                        className={`bi ${inscricao.presente ? "bi-check2-circle" : "bi-circle"}`}
                        aria-hidden="true"
                      />
                    </button>
                  </td>
                  <td className="text-body-secondary">
                    {formatarData(inscricao.dataInscricao)}
                  </td>
                  <td className="text-end">
                    <div className="d-flex gap-1 justify-content-end">
                      {inscricao.status !== "CONFIRMADA" && (
                        <button
                          type="button"
                          className="btn btn-outline-success btn-sm"
                          aria-label={`Confirmar inscrição de ${inscricao.usuarioNome}`}
                          onClick={() =>
                            abrirConfirmacao("confirmar", inscricao)
                          }
                          disabled={salvando}
                        >
                          <i className="bi bi-check-lg" aria-hidden="true" />
                        </button>
                      )}
                      {inscricao.status !== "CANCELADA" && (
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          aria-label={`Excluir inscrição de ${inscricao.usuarioNome}`}
                          onClick={() =>
                            abrirConfirmacao("cancelar", inscricao)
                          }
                          disabled={salvando}
                        >
                          <i className="bi bi-trash3" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-between align-items-center mt-2 me-2">
            <span className="badge bg-primary bg-opacity-10 text-primary">
              {lista.length} inscrição(ões)
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
        </div>
      )}

      {modal.estaAberto && (
        <BaseModal titulo="Nova inscrição" onFechar={modal.fechar}>
          <InscricaoForm
            key="nova-inscricao"
            usuarios={usuarios}
            eventos={eventos}
            onSalvar={handleSalvar}
            onCancelar={modal.fechar}
            salvando={salvando}
          />
        </BaseModal>
      )}

      <ConfirmacaoModal
        aberto={confirmacao.aberto}
        titulo={tituloModal}
        mensagem={confirmacao.mensagem}
        textoBotao={textoBotaoModal}
        variante={varianteModal}
        onConfirmar={handleConfirmarAcao}
        onCancelar={limparConfirmacao}
        carregando={salvando}
      />
    </>
  );
}