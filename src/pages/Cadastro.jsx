import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usuarioService } from "../services/usuarioService";
import { validarCadastro } from "../utils/validacoes";

const PERFIL_USER_ID = 2;

export default function Cadastro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    funcao: "",
  });
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  useEffect(() => {
    if (!sucesso) return;
    const timer = setTimeout(() => navigate("/login"), 2000);
    return () => clearTimeout(timer);
  }, [sucesso, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErro("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const erro = validarCadastro(form);
    if (erro) {
      setErro(erro);
      return;
    }

    setCarregando(true);
    setErro("");
    try {
      await usuarioService.salvar({
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        funcao: form.funcao,
        perfisIds: [PERFIL_USER_ID],
      });
      setSucesso(true);
    } catch (err) {
      setErro(err.message || "Erro ao realizar cadastro. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="sge-login-bg d-flex align-items-center justify-content-center min-vh-100">
      <div className="sge-bg-shape sge-bg-shape-1" />
      <div className="sge-bg-shape sge-bg-shape-2" />
      <div className="sge-bg-shape sge-bg-shape-3" />

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">
            <div className="card sge-login-card shadow-lg border-0">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="sge-logo-circle mx-auto mb-3">
                    <i className="bi bi-person-plus fs-4" />
                  </div>
                  <h4 className="fw-bold text-body-emphasis mb-1">
                    Criar conta
                  </h4>
                  <p className="text-body-secondary small">
                    Sistema de Gestão de Eventos
                  </p>
                </div>

                <hr className="sge-divider mb-4" />

                {sucesso && (
                  <div
                    className="alert alert-success py-2 small text-center"
                    role="alert"
                  >
                    <i className="bi bi-check-circle-fill me-2" />
                    Cadastro realizado! Redirecionando para o login...
                  </div>
                )}

                {erro && (
                  <div
                    className="alert alert-danger alert-dismissible fade show py-2 small"
                    role="alert"
                  >
                    <i className="bi bi-exclamation-triangle-fill me-2" />
                    {erro}
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setErro("")}
                      aria-label="Fechar"
                    />
                  </div>
                )}

                {!sucesso && (
                  <form onSubmit={handleSubmit} noValidate>
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
                          value={form.nome}
                          onChange={handleChange}
                          required
                          autoFocus
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="email"
                        className="form-label fw-semibold small text-body-emphasis"
                      >
                        E-mail
                      </label>
                      <div className="input-group">
                        <span className="input-group-text sge-input-addon">
                          <i className="bi bi-envelope" />
                        </span>
                        <input
                          type="email"
                          className="form-control sge-input"
                          id="email"
                          name="email"
                          placeholder="seu@email.com"
                          value={form.email}
                          onChange={handleChange}
                          required
                          autoComplete="email"
                        />
                      </div>
                    </div>

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
                          value={form.funcao}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Selecione...</option>
                          <option value="ALUNO">Aluno</option>
                          <option value="PROFESSOR">Professor</option>
                          <option value="SERVIDOR">Servidor</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="senha"
                        className="form-label fw-semibold small text-body-emphasis"
                      >
                        Senha
                      </label>
                      <div className="input-group">
                        <span className="input-group-text sge-input-addon">
                          <i className="bi bi-lock" />
                        </span>
                        <input
                          type={mostrarSenha ? "text" : "password"}
                          className="form-control sge-input"
                          id="senha"
                          name="senha"
                          placeholder="••••••••"
                          value={form.senha}
                          onChange={handleChange}
                          required
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className="btn sge-toggle-pw input-group-text"
                          onClick={() => setMostrarSenha(!mostrarSenha)}
                          tabIndex={-1}
                        >
                          <i
                            className={`bi ${mostrarSenha ? "bi-eye-slash" : "bi-eye"}`}
                          />
                        </button>
                      </div>
                    </div>

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
                          type={mostrarConfirmar ? "text" : "password"}
                          className="form-control sge-input"
                          id="confirmarSenha"
                          name="confirmarSenha"
                          placeholder="••••••••"
                          value={form.confirmarSenha}
                          onChange={handleChange}
                          required
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className="btn sge-toggle-pw input-group-text"
                          onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                          tabIndex={-1}
                        >
                          <i
                            className={`bi ${mostrarConfirmar ? "bi-eye-slash" : "bi-eye"}`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="d-grid">
                      <button
                        type="submit"
                        className="btn btn-primary sge-btn-login"
                        disabled={carregando}
                      >
                        {carregando ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            />
                            Cadastrando...
                          </>
                        ) : (
                          <>
                            Criar conta <i className="bi bi-arrow-right ms-1" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                <p className="text-center text-body-secondary small mt-4 mb-0">
                  Já tem uma conta?{" "}
                  <button
                    className="btn btn-link sge-link fw-semibold text-decoration-none p-0 small"
                    onClick={() => navigate("/login")}
                  >
                    Entrar
                  </button>
                </p>
              </div>
            </div>

            <p className="text-center text-body-secondary small mt-3 opacity-75">
              © {new Date().getFullYear()} SGE · IFPB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
