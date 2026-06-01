export default function NomeInput({ registration, error }) {
  return (
    <div className="mb-3">
      <label htmlFor="nome" className="form-label fw-semibold small text-body-emphasis">
        Nome completo
      </label>
      <div className="input-group has-validation">
        <span className="input-group-text sge-input-addon">
          <i className="bi bi-person" />
        </span>
        <input
          type="text"
          className={`form-control sge-input ${error ? "is-invalid" : ""}`}
          id="nome"
          placeholder="Seu nome"
          autoFocus
          {...registration}
        />
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
    </div>
  );
}