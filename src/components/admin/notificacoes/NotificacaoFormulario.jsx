import { useState } from "react";

const criarEstadoInicial = () => ({
  mensagem: "",
  enviarParaTodos: true,
  usuarioId: "",
});

const montarPayload = (dados) => ({
  mensagem: dados.mensagem.trim(),
  destinatario: dados.enviarParaTodos ? "TODOS" : dados.usuarioId,
});

export function NotificacaoFormulario({
  usuarios = [],
  onEnviar,
  onCancelar,
  salvando = false,
}) {
  const [dados, setDados] = useState(() => criarEstadoInicial());

  const atualizarCampo = (campo) => (evento) => {
    setDados((atual) => ({ ...atual, [campo]: evento.target.value }));
  };

  const selecionarTodosUsuarios = () => {
    setDados((atual) => ({
      ...atual,
      enviarParaTodos: true,
      usuarioId: "",
    }));
  };

  const selecionarUsuarioEspecifico = () => {
    setDados((atual) => ({
      ...atual,
      enviarParaTodos: false,
    }));
  };

  const handleSubmit = (evento) => {
    evento.preventDefault();
    onEnviar(montarPayload(dados));
  };

  const exigeUsuario = !dados.enviarParaTodos;
  const usuarioNaoSelecionado = exigeUsuario && !dados.usuarioId;

  return (
    <form onSubmit={handleSubmit} className="row g-3" noValidate>
      <div className="col-12">
        <label
          htmlFor="notificacao-mensagem"
          className="form-label fw-semibold small"
        >
          Mensagem *
        </label>
        <textarea
          id="notificacao-mensagem"
          className="form-control sge-input"
          rows={4}
          value={dados.mensagem}
          onChange={atualizarCampo("mensagem")}
          required
          disabled={salvando}
          placeholder="Digite a mensagem da notificação..."
        />
      </div>

      <div className="col-12">
        <span className="form-label fw-semibold small d-block">Destinatário</span>
        <div
          className="d-flex gap-3 mb-2"
          role="radiogroup"
          aria-label="Tipo de destinatário"
        >
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              id="notificacao-dest-todos"
              name="notificacao-destinatario"
              checked={dados.enviarParaTodos}
              onChange={selecionarTodosUsuarios}
              disabled={salvando}
            />
            <label
              className="form-check-label small"
              htmlFor="notificacao-dest-todos"
            >
              <i className="bi bi-people me-1" aria-hidden="true" />
              Todos os usuários
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              id="notificacao-dest-usuario"
              name="notificacao-destinatario"
              checked={exigeUsuario}
              onChange={selecionarUsuarioEspecifico}
              disabled={salvando}
            />
            <label
              className="form-check-label small"
              htmlFor="notificacao-dest-usuario"
            >
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
              className="form-select sge-input"
              value={dados.usuarioId}
              onChange={atualizarCampo("usuarioId")}
              required
              disabled={salvando}
            >
              <option value="">Selecione o usuário...</option>
              {usuarios.map((usuario) => (
                <option key={usuario.id} value={String(usuario.id)}>
                  {usuario.nome} — {usuario.email}
                </option>
              ))}
            </select>
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
          disabled={salvando || usuarioNaoSelecionado}
        >
          {salvando ? (
            <span
              className="spinner-border spinner-border-sm me-1"
              role="status"
              aria-hidden="true"
            />
          ) : (
            <i className="bi bi-send me-1" aria-hidden="true" />
          )}
          Enviar notificação
        </button>
      </div>
    </form>
  );
}