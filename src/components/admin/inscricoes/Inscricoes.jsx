import { useState } from "react";
import { AlertaFeedback } from "../../AlertaFeedback";
import { ConfirmacaoModal } from "../ConfirmacaoModal";
import { SpinnerCentral } from "../../SpinnerCentral";
import { TabelaVazia } from "../../TabelaVazia";
import { formatarData } from "../../../utils/formatacoes";

const statusCor = {
  CONFIRMADA: "sge-badge-confirmada",
  CANCELADA: "sge-badge-cancelada",
  PENDENTE: "sge-badge-pendente",
};

export function Inscricoes({ dados, eventosList }) {
  const {
    lista,
    filtroEvento,
    setFiltroEvento,
    filtroUsuario,
    setFiltroUsuario,
    carregando,
    sucesso,
    setSucesso,
    erro,
    setErro,
    confirmar,
    cancelar,
    marcarPresenca,
  } = dados;

  const [confirmacao, setConfirmacao] = useState(null);
  const [salvando, setSalvando] = useState(false);

  const handleConfirmarOuCancelar = async () => {
    setSalvando(true);
    if (confirmacao.tipo === "confirmar") await confirmar(confirmacao.id);
    else await cancelar(confirmacao.id);
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

      <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <h6 className="fw-bold text-body-emphasis mb-0">
          <i className="bi bi-bookmark-check me-2 text-primary" />
          Inscrições ({lista.length})
        </h6>
        <div className="d-flex gap-2 flex-wrap">
          <select
            className="form-select form-select-sm sge-input"
            style={{ width: "auto", minWidth: 180 }}
            value={filtroEvento}
            onChange={(e) => setFiltroEvento(e.target.value)}
          >
            <option value="">Todos os eventos</option>
            {eventosList.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.titulo}
              </option>
            ))}
          </select>
          <input
            className="form-control form-control-sm sge-input"
            style={{ width: 180 }}
            placeholder="Buscar usuário..."
            value={filtroUsuario}
            onChange={(e) => setFiltroUsuario(e.target.value)}
          />
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
                <th>Usuário</th>
                <th>Evento</th>
                <th>Status</th>
                <th>Presente</th>
                <th>Data</th>
                <th className="text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((ins) => (
                <tr key={ins.id}>
                  <td className="fw-semibold">{ins.usuarioNome}</td>
                  <td className="text-body-secondary">{ins.eventoNome}</td>
                  <td>
                    <span
                      className={`sge-badge-status ${statusCor[ins.status] ?? "sge-badge-pendente"}`}
                    >
                      {ins.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`btn btn-sm ${ins.presente ? "btn-success" : "btn-outline-secondary"}`}
                      onClick={() => marcarPresenca(ins.id, !ins.presente)}
                      style={{ minWidth: 34, padding: "2px 8px" }}
                    >
                      <i
                        className={`bi ${ins.presente ? "bi-check2-circle" : "bi-circle"}`}
                      />
                    </button>
                  </td>
                  <td className="text-body-secondary">
                    {formatarData(ins.dataInscricao)}
                  </td>
                  <td className="text-end">
                    <div className="d-flex gap-1 justify-content-end">
                      {ins.status !== "CONFIRMADA" && (
                        <button
                          className="btn btn-outline-success btn-sm"
                          title="Confirmar"
                          onClick={() =>
                            setConfirmacao({
                              tipo: "confirmar",
                              id: ins.id,
                              item: ins,
                            })
                          }
                        >
                          <i className="bi bi-check-lg" />
                        </button>
                      )}
                      {ins.status !== "CANCELADA" && (
                        <button
                          className="btn btn-outline-danger btn-sm"
                          title="Cancelar"
                          onClick={() =>
                            setConfirmacao({
                              tipo: "cancelar",
                              id: ins.id,
                              item: ins,
                            })
                          }
                        >
                          <i className="bi bi-x-lg" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmacaoModal
        aberto={!!confirmacao}
        titulo={
          confirmacao?.tipo === "confirmar"
            ? "Confirmar inscrição"
            : "Cancelar inscrição"
        }
        mensagem={
          confirmacao?.tipo === "confirmar"
            ? `Confirmar inscrição de "${confirmacao?.item?.usuarioNome}"?`
            : `Cancelar inscrição de "${confirmacao?.item?.usuarioNome}"?`
        }
        textoBotao={
          confirmacao?.tipo === "confirmar" ? "Confirmar" : "Cancelar inscrição"
        }
        variante={confirmacao?.tipo === "confirmar" ? "success" : "warning"}
        onConfirmar={handleConfirmarOuCancelar}
        onCancelar={() => setConfirmacao(null)}
        carregando={salvando}
      />
    </>
  );
}
