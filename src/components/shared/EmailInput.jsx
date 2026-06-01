export default function EmailInput({ registration, error }) {
  return (
    <div className="mb-3">
      <label htmlFor="email" className="form-label fw-semibold small text-body-emphasis">
        E-mail
      </label>
      <div className="input-group has-validation">
        <span className="input-group-text sge-input-addon">
          <i className="bi bi-envelope" />
        </span>
        <input
          type="email"
          className={`form-control sge-input ${error ? "is-invalid" : ""}`}
          id="email"
          placeholder="seu@email.com"
          autoComplete="email"
          autoFocus
          {...registration}
        />
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
    </div>
  );
}