import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inscricaoSchema } from "../../../utils/admin/inscricaoSchema";

export default function InscricaoForm({
  usuarios = [],
  eventos = [],
  onSalvar,
  onCancelar,
  salvando = false,
}) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(inscricaoSchema),
    defaultValues: { usuarioId: "", eventoId: "" },
  });

  const onSubmit = (data) => onSalvar(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="row g-3" noValidate>
      <div className="col-12">
        <label htmlFor="inscricao-usuario" className="form-label fw-semibold small">
          Usuário *
        </label>
        <select
          id="inscricao-usuario"
          className={`form-select sge-input${errors.usuarioId ? " is-invalid" : ""}`}
          disabled={salvando}
          {...register("usuarioId", {
            setValueAs: (v) => (v === "" ? null : Number(v)),
          })}
        >
          <option value="">Selecione um usuário...</option>
          {usuarios.map((u) => (
            <option key={u.id} value={String(u.id)}>
              {u.nome} — {u.email}
            </option>
          ))}
        </select>
        {errors.usuarioId && (
          <div className="invalid-feedback">{errors.usuarioId.message}</div>
        )}
      </div>

      <div className="col-12">
        <label htmlFor="inscricao-evento" className="form-label fw-semibold small">
          Evento *
        </label>
        <select
          id="inscricao-evento"
          className={`form-select sge-input${errors.eventoId ? " is-invalid" : ""}`}
          disabled={salvando}
          {...register("eventoId", {
            setValueAs: (v) => (v === "" ? null : Number(v)),
          })}
        >
          <option value="">Selecione um evento...</option>
          {eventos.map((ev) => (
            <option key={ev.id} value={String(ev.id)}>
              {ev.titulo}
            </option>
          ))}
        </select>
        {errors.eventoId && (
          <div className="invalid-feedback">{errors.eventoId.message}</div>
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
          Criar inscrição
        </button>
      </div>
    </form>
  );
}
