export default function FuncaoSelect({ registration, error }) {
  return (
    <div className="mb-3">
      <label htmlFor="funcao" className="form-label fw-semibold small text-body-emphasis">
        Função
      </label>
      <div className="input-group has-validation">
        <span className="input-group-text sge-input-addon">
          <i className="bi bi-briefcase" />
        </span>
        <select
          className={`form-select sge-input ${error ? "is-invalid" : ""}`}
          id="funcao"
          {...registration}
        >
          <option value="">Selecione...</option>
          <option value="ALUNO">Aluno</option>
          <option value="PROFESSOR">Professor</option>
          <option value="SERVIDOR">Servidor</option>
        </select>
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
    </div>
  );
}