export default function SenhaConfirmacaoInput({
  registration,
  error,
  mostrarSenha,
  toggleSenha,
  label = "Confirmar senha",
  disabled,
}) {
  return (
    <div className="mb-4">
      <label htmlFor="confirmarSenha" className="form-label fw-semibold small text-body-emphasis">
        {label}
      </label>
      <div className="input-group has-validation">
        <span className="input-group-text sge-input-addon">
          <i className="bi bi-lock-fill" />
        </span>
        <input
          type={mostrarSenha ? "text" : "password"}
          className={`form-control sge-input ${error ? "is-invalid" : ""}`}
          id="confirmarSenha"
          placeholder="••••••••"
          autoComplete="new-password"
          disabled={disabled}
          {...registration}
        />
        <button
          type="button"
          className="btn sge-toggle-pw input-group-text"
          onClick={toggleSenha}
          tabIndex={-1}
        >
          <i className={`bi ${mostrarSenha ? "bi-eye-slash" : "bi-eye"}`} />
        </button>
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
    </div>
  );
}