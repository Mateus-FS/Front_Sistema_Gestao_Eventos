import { useForm, Controller } from "react-hook-form";

const FUNCOES = ["ALUNO", "PROFESSOR", "SERVIDOR"];

export default function UsuarioFormulario({
  valoresIniciais = {},
  perfis = [],
  onSalvar,
  onCancelar,
  salvando = false,
}) {
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      funcao: valoresIniciais.funcao ?? "",
      perfis: valoresIniciais.perfis?.map((p) => Number(p.id ?? p)) ?? [],
    },
  });

  const onSubmit = (data) =>
    onSalvar({ funcao: data.funcao || null, perfis: data.perfis });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="row g-3" noValidate>
      <div className="col-12">
        <p className="small text-body-secondary mb-2">
          <i className="bi bi-person me-1" aria-hidden="true" />
          <strong>{valoresIniciais.nome}</strong> — {valoresIniciais.email}
        </p>
      </div>

      <div className="col-12">
        <label htmlFor="usuario-funcao" className="form-label fw-semibold small">
          Função
        </label>
        <select
          id="usuario-funcao"
          className="form-select sge-input"
          disabled={salvando}
          {...register("funcao")}
          {...register("funcao")}
        >
          <option value="">Sem função</option>
          {FUNCOES.map((funcao) => (
            <option key={funcao} value={funcao}>
              {funcao}
            </option>
          ))}
        </select>
      </div>

      {perfis.length > 0 && (
        <div className="col-12">
          <span className="form-label fw-semibold small d-block">Perfis</span>
          <Controller
            name="perfis"
            control={control}
            render={({ field }) => (
              <div
                className="d-flex flex-wrap gap-2"
                role="group"
                aria-label="Perfis do usuário"
              >
                {perfis.map((perfil) => {
                  const perfilId = Number(perfil.id);
                  const selecionado = field.value.includes(perfilId);
          <Controller
            name="perfis"
            control={control}
            render={({ field }) => (
              <div
                className="d-flex flex-wrap gap-2"
                role="group"
                aria-label="Perfis do usuário"
              >
                {perfis.map((perfil) => {
                  const perfilId = Number(perfil.id);
                  const selecionado = field.value.includes(perfilId);

                  return (
                    <button
                      key={perfil.id}
                      type="button"
                      onClick={() =>
                        field.onChange(
                          selecionado
                            ? field.value.filter((id) => id !== perfilId)
                            : [...field.value, perfilId]
                        )
                      }
                      disabled={salvando}
                      aria-pressed={selecionado}
                      className={`btn btn-sm ${
                        selecionado ? "btn-primary" : "btn-outline-secondary"
                      }`}
                    >
                      {selecionado && (
                        <i className="bi bi-check me-1" aria-hidden="true" />
                      )}
                      {perfil.nome}
                    </button>
                  );
                })}
              </div>
            )}
          />
                  return (
                    <button
                      key={perfil.id}
                      type="button"
                      onClick={() =>
                        field.onChange(
                          selecionado
                            ? field.value.filter((id) => id !== perfilId)
                            : [...field.value, perfilId]
                        )
                      }
                      disabled={salvando}
                      aria-pressed={selecionado}
                      className={`btn btn-sm ${
                        selecionado ? "btn-primary" : "btn-outline-secondary"
                      }`}
                    >
                      {selecionado && (
                        <i className="bi bi-check me-1" aria-hidden="true" />
                      )}
                      {perfil.nome}
                    </button>
                  );
                })}
              </div>
            )}
          />
        </div>
      )}

      <div className="col-12 d-flex gap-2 justify-content-end pt-2">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={onCancelar}
          disabled={salvando}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn sge-btn-login btn-sm text-white"
          disabled={salvando}
        >
          {salvando ? (
            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
          ) : (
            <i className="bi bi-check-lg me-1" aria-hidden="true" />
          )}
          Salvar alterações
        </button>
      </div>
    </form>
  );
}
