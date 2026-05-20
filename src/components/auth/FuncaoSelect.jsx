export default function FuncaoSelect({ value, onChange }) {
  return (
    <div className="mb-3">
      <label
        htmlFor="funcao"
        className="form-label fw-semibold small text-body-emphasis"
      >
        Função
      </label>
      <div className="input-group">
        <span className="input-group-text sge-input-addon">
          <i className="bi bi-briefcase" />
        </span>
        <select
          className="form-select sge-input"
          id="funcao"
          name="funcao"
          value={value}
          onChange={onChange}
          required
        >
          <option value="">Selecione...</option>
          <option value="ALUNO">Aluno</option>
          <option value="PROFESSOR">Professor</option>
          <option value="SERVIDOR">Servidor</option>
        </select>
      </div>
    </div>
  );
}
