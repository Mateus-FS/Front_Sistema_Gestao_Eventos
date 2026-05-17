export function Navbar({ onSair }) {
  return (
    <nav className="navbar navbar-light bg-white border-bottom shadow-sm px-4 py-3">
      <div className="d-flex align-items-center gap-2">
        <div className="sge-logo-circle-sm">
          <i className="bi bi-calendar-event" />
        </div>
        <span className="navbar-brand fw-bold text-primary mb-0">SGE</span>
        <span className="text-body-secondary small d-none d-md-inline">
          · Sistema de Gestão de Eventos
        </span>
      </div>
      <button
        className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
        onClick={onSair}
      >
        <i className="bi bi-box-arrow-right" />
        <span className="d-none d-sm-inline">Sair</span>
      </button>
    </nav>
  );
}