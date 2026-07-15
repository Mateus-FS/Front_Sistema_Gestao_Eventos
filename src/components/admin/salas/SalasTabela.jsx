import { useState } from "react";
import { useConfirmacao } from "../../../hooks/ui/useConfirmacao";
import { useModalEdicao } from "../../../hooks/ui/useModalEdicao";
import SpinnerCentral from "../../shared/SpinnerCentral";
import TabelaVazia from "../../shared/TabelaVazia";
import BaseModal from "../BaseModal";
import ConfirmacaoModal from "../ConfirmacaoModal";
import SalaForm from "./SalaForm";

const ITENS_POR_PAGINA = 5;

export default function SalasTabela({ dados }) {
  const { lista, carregando, salvando, salvar, deletar } = dados;

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
          {listaPaginada.map((sala) => (
            <div key={sala.id} className="col-md-4 col-sm-6">
              <div className="card sge-card border h-100">
                <div className="card-body">
                  <div className="d-flex align-items-start justify-content-between">
                    <div>
                      <div className="fw-bold text-body-emphasis">
                        {sala.nome}
                      </div>
                      <div className="text-body-secondary small mt-1">
                        <i className="bi bi-building me-1" aria-hidden="true" />
                        Bloco {sala.bloco || "—"}
                      </div>
                      <div className="text-body-secondary small">
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
          <div className="d-flex justify-content-between align-items-center mt-2 me-2">
            <span className="badge bg-primary bg-opacity-10 text-primary">
              {lista.length} sala(s)
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
          titulo={modal.estaEditando ? "Editar sala" : "Nova sala"}
          onFechar={modal.fechar}
        >
          <SalaForm
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