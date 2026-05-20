export default function SenhaConfirmacaoInput({
  value,
  onChange,
  mostrarSenha,
  toggleSenha,
}) {
  return (
    <div className="mb-4">
      <label
        htmlFor="confirmarSenha"
        className="form-label fw-semibold small text-body-emphasis"
      >
        Confirmar senha
      </label>
      <div className="input-group">
        <span className="input-group-text sge-input-addon">
          <i className="bi bi-lock-fill" />
        </span>
        <input
          type={mostrarSenha ? "text" : "password"}
          className="form-control sge-input"
          id="confirmarSenha"
          name="confirmarSenha"
          placeholder="••••••••"
          value={value}
          onChange={onChange}
          required
          autoComplete="new-password"
        />
        <button
          type="button"
          className="btn sge-toggle-pw input-group-text"
          onClick={toggleSenha}
          tabIndex={-1}
        >
          <i className={`bi ${mostrarSenha ? "bi-eye-slash" : "bi-eye"}`} />
        </button>
      </div>
    </div>
  );
}
