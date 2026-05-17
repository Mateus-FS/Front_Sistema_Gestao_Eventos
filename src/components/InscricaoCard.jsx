export function InscricaoCard({ inscricao, onDesinscrever }) {
  return (
    <div className="col-12 col-md-6">
      <div className="card sge-card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex align-items-start justify-content-between mb-2">
            <h6 className="fw-bold text-body-emphasis mb-0">{inscricao.eventoNome}</h6>
            <span className={`sge-badge-status ms-2 ${
              inscricao.status === "CONFIRMADA" ? "sge-badge-confirmada"
              : inscricao.status === "CANCELADA" ? "sge-badge-cancelada"
              : "sge-badge-pendente"
            }`}>
              {inscricao.status}
            </span>
          </div>
          <p className="text-body-secondary small mb-2">
            <i className="bi bi-calendar2 me-1" />
            Inscrito em: {inscricao.dataInscricao}
          </p>
          <div className="d-flex align-items-center justify-content-between">
            <span className={`small ${inscricao.presente ? "text-success" : "text-body-secondary"}`}>
              <i className={`bi ${inscricao.presente ? "bi-check-circle-fill" : "bi-circle"} me-1`} />
              {inscricao.presente ? "Presença confirmada" : "Presença pendente"}
            </span>
            {inscricao.status !== "CANCELADA" && (
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => onDesinscrever(inscricao.id)}
              >
                <i className="bi bi-x-circle me-1" />
                Desinscrever
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}