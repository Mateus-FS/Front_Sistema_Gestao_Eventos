import { formatarData } from "../utils/formatacoes";

export function EventoCard({ evento, onInscrever }) {
  return (
    <div className="col-12 col-md-6 col-lg-4">
      <div className="card sge-card h-100 border-0 shadow-sm">
        <div className="card-body d-flex flex-column">
          <div className="d-flex align-items-start justify-content-between mb-2">
            <span className="sge-badge-tipo text-uppercase">
              {evento.tipoEvento ?? "Evento"}
            </span>
            <span className="text-body-secondary small">
              <i className="bi bi-people me-1" />
              {evento.totalInscricoes ?? 0}
            </span>
          </div>
          <h6 className="fw-bold text-body-emphasis mb-1">{evento.titulo}</h6>
          <p className="text-body-secondary small mb-2 flex-grow-1">{evento.descricao}</p>
          <div className="d-flex flex-column gap-1 small text-body-secondary mb-3">
            <div>
              <i className="bi bi-calendar2 me-1" />
              {formatarData(evento.dataInicio)} → {formatarData(evento.dataTermino)}
            </div>
            {evento.salaNome && (
              <div>
                <i className="bi bi-geo-alt me-1" />
                {evento.salaLocalizacao ? `${evento.salaLocalizacao} - ` : ""}
                {evento.salaNome}
              </div>
            )}
            {evento.organizadorNome && (
              <div>
                <i className="bi bi-person me-1" />
                {evento.organizadorNome}
              </div>
            )}
          </div>
          <button
            className="btn btn-primary sge-btn-inscricao w-100 mt-auto"
            onClick={() => onInscrever(evento.id)}
          >
            <i className="bi bi-plus-circle me-2" />
            Inscrever-se
          </button>
        </div>
      </div>
    </div>
  );
}