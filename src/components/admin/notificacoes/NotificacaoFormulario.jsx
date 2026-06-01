import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { notificacaoSchema } from "../../../utils/admin/notificacaoSchema";

export default function NotificacaoFormulario({
  usuarios = [],
  onEnviar,
  onCancelar,
  salvando = false,
}) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(notificacaoSchema),
    defaultValues: { mensagem: "", destinatario: "todos", usuarioId: "" },
  });

  const destinatario = watch("destinatario");
  const exigeUsuario = destinatario === "especifico";

  const onSubmit = (data) => {
    onEnviar({
      mensagem: data.mensagem,
      usuarioId: exigeUsuario && data.usuarioId ? Number(data.usuarioId) : null,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="row g-3" noValidate>
      <div className="col-12">
        <label htmlFor="notificacao-mensagem" className="form-label fw-semibold small">
          Mensagem *
        </label>
        <textarea
          id="notificacao-mensagem"
          className={`form-control sge-input${errors.mensagem ? " is-invalid" : ""}`}
          rows={4}
          disabled={salvando}
          placeholder="Digite a mensagem da notificação..."
          {...register("mensagem")}
        />
        {errors.mensagem && (
          <div className="invalid-feedback">{errors.mensagem.message}</div>
        )}
      </div>

      <div className="col-12">
        <span className="form-label fw-semibold small d-block">Destinatário</span>
        <div className="d-flex gap-3 mb-2" role="radiogroup" aria-label="Tipo de destinatário">
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              id="notificacao-dest-todos"
              value="todos"
              disabled={salvando}
              {...register("destinatario")}
            />
            <label className="form-check-label small" htmlFor="notificacao-dest-todos">
              <i className="bi bi-people me-1" aria-hidden="true" />
              Todos os usuários
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              id="notificacao-dest-usuario"
              value="especifico"
              disabled={salvando}
              {...register("destinatario")}
            />
            <label className="form-check-label small" htmlFor="notificacao-dest-usuario">
              <i className="bi bi-person me-1" aria-hidden="true" />
              Usuário específico
            </label>
          </div>
        </div>

        {exigeUsuario && (
          <>
            <label
              htmlFor="notificacao-usuario"
              className="form-label fw-semibold small visually-hidden"
            >
              Usuário
            </label>
            <select
              id="notificacao-usuario"
              className={`form-select sge-input${errors.usuarioId ? " is-invalid" : ""}`}
              disabled={salvando}
              {...register("usuarioId")}
            >
              <option value="">Selecione o usuário...</option>
              {usuarios.map((usuario) => (
                <option key={usuario.id} value={String(usuario.id)}>
                  {usuario.nome} — {usuario.email}
                </option>
              ))}
            </select>
            {errors.usuarioId && (
              <div className="invalid-feedback">{errors.usuarioId.message}</div>
            )}
          </>
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
            <i className="bi bi-send me-1" aria-hidden="true" />
          )}
          Enviar notificação
        </button>
      </div>
    </form>
  );
}
