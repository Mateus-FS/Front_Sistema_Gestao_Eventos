import { useState } from "react";
import { useConfirmacao } from "../../../hooks/ui/useConfirmacao";
import { useModalEdicao } from "../../../hooks/ui/useModalEdicao";
import { formatarData, formatarSala } from "../../../utils/formatacoes";
import SpinnerCentral from "../../shared/SpinnerCentral";
import TabelaVazia from "../../shared/TabelaVazia";
import BaseModal from "../BaseModal";
import ConfirmacaoModal from "../ConfirmacaoModal";
import EventoForm from "./EventoForm";

const ITENS_POR_PAGINA = 5;

export default function EventosTabela({ dados }) {
  const { lista, salas, organizadores, carregando, salvando, salvar, deletar } =
    dados;

  const [pagina, setPagina] = useState(1);

  const modal = useModalEdicao();
  const confirmacao = useConfirmacao();

  const totalPaginas = Math.ceil(lista.length / ITENS_POR_PAGINA);
  const listaPaginada = lista.slice(
    (pagina - 1) * ITENS_POR_PAGINA,
    pagina * ITENS_POR_PAGINA
  );

  const handleSalvar = async (dadosFormulario) => {
    const idEdicao = modal.estaEditando ? modal.itemAtual.id : null;
    await salvar({ dados: dadosFormulario, id: idEdicao });
    modal.fechar();
  };

  const handleConfirmarExclusao = async () => {
    await deletar(confirmacao.id);
    confirmacao.cancelar();
  };

  const chaveFormulario = modal.estaEditando
    ? `editar-${modal.itemAtual.id}`
    : "novo";

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h6 className="fw-bold text-body-emphasis mb-0">
          <i
            className="bi bi-calendar-event me-2 text-primary"
            aria-hidden="true"
          />
          Gerenciar eventos
        </h6>
        <button
          type="button"
          className="btn sge-btn-login btn-sm text-white"
          onClick={modal.abrirNovo}
          disabled={carregando || salvando}
        >
          <i className="bi bi-plus-lg me-1" aria-hidden="true" />
          Novo evento
        </button>
      </div>

      {carregando ? (
        <SpinnerCentral />
      ) : lista.length === 0 ? (
        <TabelaVazia icone="bi-calendar-x" texto="Nenhum evento cadastrado." />
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle small">
            <thead className="table-light">
              <tr>
                <th scope="col">Título</th>
                <th scope="col">Tipo</th>
                <th scope="col">Início</th>
                <th scope="col">Sala</th>
                <th scope="col">Organizador</th>
                <th scope="col">Inscrições</th>
                <th scope="col" className="text-end">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {listaPaginada.map((evento) => (
                <tr key={evento.id}>
                  <td className="fw-semibold">{evento.titulo}</td>
                  <td>
                    <span className="sge-badge-tipo">{evento.tipoEvento}</span>
                  </td>
                  <td>{formatarData(evento.dataInicio)}</td>
                  <td>{formatarSala(evento)}</td>
                  <td>{evento.organizadorNome ?? "—"}</td>
                  <td>
                    <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill">
                      {evento.totalInscricoes ?? 0}
                    </span>
                  </td>
                  <td className="text-end">
                    <div className="d-flex gap-1 justify-content-end">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        title="Editar"
                        aria-label={`Editar evento ${evento.titulo}`}
                        onClick={() => modal.abrirEdicao(evento)}
                        disabled={salvando}
                      >
                        <i className="bi bi-pencil" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        title="Excluir"
                        aria-label={`Excluir evento ${evento.titulo}`}
                        onClick={() =>
                          confirmacao.confirmar(
                            evento.id,
                            `Tem certeza que deseja remover "${evento.titulo}"?`,
                          )
                        }
                        disabled={salvando}
                      >
                        <i className="bi bi-trash3" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-between align-items-center mt-2 me-2">
            <span className="badge bg-primary bg-opacity-10 text-primary">
              {lista.length} evento(s)
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
        <BaseModal
          titulo={modal.estaEditando ? "Editar evento" : "Novo evento"}
          onFechar={modal.fechar}
        >
          <EventoForm
            key={chaveFormulario}
            valoresIniciais={modal.itemAtual}
            salas={salas}
            organizadores={organizadores}
            onSalvar={handleSalvar}
            onCancelar={modal.fechar}
            salvando={salvando}
          />
        </BaseModal>
      )}

      <ConfirmacaoModal
        aberto={confirmacao.aberto}
        titulo="Excluir evento"
        mensagem={confirmacao.mensagem}
        textoBotao="Excluir"
        onConfirmar={handleConfirmarExclusao}
        onCancelar={confirmacao.cancelar}
        carregando={salvando}
      />
    </>
  );
}
