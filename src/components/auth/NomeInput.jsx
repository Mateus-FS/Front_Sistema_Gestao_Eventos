export default function NomeInput({ value, onChange }) {
  return (
    <div className="mb-3">
      <label
        htmlFor="nome"
        className="form-label fw-semibold small text-body-emphasis"
      >
        Nome completo
      </label>
      <div className="input-group">
        <span className="input-group-text sge-input-addon">
          <i className="bi bi-person" />
        </span>
        <input
          type="text"
          className="form-control sge-input"
          id="nome"
          name="nome"
          placeholder="Seu nome"
          value={value}
          onChange={onChange}
          required
          autoFocus
        />
      </div>
    </div>
  );
}
