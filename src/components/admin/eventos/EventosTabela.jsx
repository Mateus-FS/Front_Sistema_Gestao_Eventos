import { AlertaFeedback } from "../../AlertaFeedback";
import { ConfirmacaoModal } from "../ConfirmacaoModal";
import { BaseModal } from "../BaseModal";
import { SpinnerCentral } from "../../SpinnerCentral";
import { TabelaVazia } from "../../TabelaVazia";
import { useConfirmacao } from "../../../hooks/ui/useConfirmacao";
import { useModalEdicao } from "../../../hooks/ui/useModalEdicao";
import { formatarData } from "../../../utils/formatacoes";
import { EventoFormulario } from "./EventoFormulario";

export function EventosTabela({ dados }) {
  const {
    lista,
    salas,
    organizadores,
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

  const handleSalvar = async (formData) => {
    const ok = await salvar(
      formData,
      modal.estaEditando ? modal.itemAtual.id : null,
    );
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
          <i className="bi bi-calendar-event me-2 text-primary" />
          Gerenciar eventos
        </h6>
        <button
          className="btn sge-btn-login btn-sm text-white"
          onClick={modal.abrirNovo}
        >
          <i className="bi bi-plus-lg me-1" /> Novo evento
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
                <th>Título</th>
                <th>Tipo</th>
                <th>Início</th>
                <th>Sala</th>
                <th>Organizador</th>
                <th>Inscrições</th>
                <th className="text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((ev) => (
                <tr key={ev.id}>
                  <td className="fw-semibold">{ev.titulo}</td>
                  <td>
                    <span className="sge-badge-tipo">{ev.tipoEvento}</span>
                  </td>
                  <td>{formatarData(ev.dataInicio)}</td>
                  <td>
                    {ev.salaNome
                      ? `${ev.salaLocalizacao ? ev.salaLocalizacao + " - " : ""}${ev.salaNome}`
                      : "—"}
                  </td>
                  <td>{ev.organizadorNome}</td>
                  <td>
                    <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill">
                      {ev.totalInscricoes ?? 0}
                    </span>
                  </td>
                  <td className="text-end">
                    <div className="d-flex gap-1 justify-content-end">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        title="Editar"
                        onClick={() => modal.abrirEdicao(ev)}
                      >
                        <i className="bi bi-pencil" />
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        title="Deletar"
                        onClick={() =>
                          confirmacao.confirmar(
                            ev.id,
                            `Tem certeza que deseja remover "${ev.titulo}"?`,
                          )
                        }
                      >
                        <i className="bi bi-trash3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal.estaAberto && (
        <BaseModal
          titulo={modal.estaEditando ? "Editar evento" : "Novo evento"}
          onFechar={modal.fechar}
        >
          <EventoFormulario
            inicial={modal.itemAtual}
            salas={salas}
            organizadores={organizadores}
            onSalvar={handleSalvar}
            onCancelar={modal.fechar}
            carregando={salvando}
          />
        </BaseModal>
      )}

      <ConfirmacaoModal
        aberto={confirmacao.aberto}
        titulo="Deletar evento"
        mensagem={confirmacao.mensagem}
        textoBotao="Deletar"
        onConfirmar={handleDeletar}
        onCancelar={confirmacao.cancelar}
        carregando={salvando}
      />
    </>
  );
}