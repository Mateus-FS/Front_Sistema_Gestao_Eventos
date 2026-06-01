import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { salaSchema } from "../../../utils/admin/salaSchema";

export default function SalaFormulario({
  valoresIniciais = {},
  onSalvar,
  onCancelar,
  salvando = false,
}) {
  const modoEdicao = Boolean(valoresIniciais.id);

  const { register,handleSubmit,formState: { errors } } = useForm({
    resolver: zodResolver(salaSchema),
    defaultValues: {
      nome: valoresIniciais.nome ?? "",
      localizacao: valoresIniciais.localizacao ?? "",
      capacidade: valoresIniciais.capacidade ?? "",
    },
  });

  const onSubmit = (data) => onSalvar(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="row g-3" noValidate>
      <div className="col-12">
        <label htmlFor="sala-nome" className="form-label fw-semibold small">
          Nome *
        </label>
        <input
          id="sala-nome"
          className={`form-control sge-input${errors.nome ? " is-invalid" : ""}`}
          disabled={salvando}
          placeholder="Ex: Auditório Principal"
          {...register("nome")}
        />
        {errors.nome && (
          <div className="invalid-feedback">{errors.nome.message}</div>
        )}
      </div>

      <div className="col-md-8">
        <label htmlFor="sala-localizacao" className="form-label fw-semibold small">
          Localização
        </label>
        <input
          id="sala-localizacao"
          className={`form-control sge-input${errors.localizacao ? " is-invalid" : ""}`}
          disabled={salvando}
          placeholder="Ex: Bloco A, 2º andar"
          {...register("localizacao")}
        />
        {errors.localizacao && (
          <div className="invalid-feedback">{errors.localizacao.message}</div>
        )}
      </div>

      <div className="col-md-4">
        <label htmlFor="sala-capacidade" className="form-label fw-semibold small">
          Capacidade *
        </label>
        <input
          id="sala-capacidade"
          type="number"
          min={1}
          className={`form-control sge-input${errors.capacidade ? " is-invalid" : ""}`}
          disabled={salvando}
          placeholder="100"
          {...register("capacidade", { valueAsNumber: true })}
        />
        {errors.capacidade && (
          <div className="invalid-feedback">{errors.capacidade.message}</div>
        )}
      </div>

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
          {modoEdicao ? "Salvar alterações" : "Criar sala"}
        </button>
      </div>
    </form>
  );
}
