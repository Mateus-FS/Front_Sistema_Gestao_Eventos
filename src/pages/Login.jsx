import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    try {
      await login(email, senha);
    } catch (err) {
      setErro(err.message || "E-mail ou senha inválidos. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="sge-login-bg d-flex align-items-center justify-content-center min-vh-100">
      {/* Shapes decorativos */}
      <div className="sge-bg-shape sge-bg-shape-1" />
      <div className="sge-bg-shape sge-bg-shape-2" />
      <div className="sge-bg-shape sge-bg-shape-3" />

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">
            <div className="card sge-login-card shadow-lg border-0">
              <div className="card-body p-4 p-md-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="sge-logo-circle mx-auto mb-3">
                    <i className="bi bi-calendar-event fs-4" />
                  </div>
                  <h4 className="fw-bold text-body-emphasis mb-1">SGE</h4>
                  <p className="text-body-secondary small">
                    Sistema de Gestão de Eventos
                  </p>
                </div>

                <hr className="sge-divider mb-4" />

                {/* Erro */}
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

                {/* Formulário */}
                <form onSubmit={handleSubmit} noValidate>
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
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label
                        htmlFor="senha"
                        className="form-label fw-semibold small text-body-emphasis mb-0"
                      >
                        Senha
                      </label>
                      <a
                        href="#"
                        className="sge-link small text-decoration-none"
                      >
                        Esqueceu a senha?
                      </a>
                    </div>
                    <div className="input-group">
                      <span className="input-group-text sge-input-addon">
                        <i className="bi bi-lock" />
                      </span>
                      <input
                        type={mostrarSenha ? "text" : "password"}
                        className="form-control sge-input"
                        id="senha"
                        placeholder="••••••••"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="btn sge-toggle-pw input-group-text"
                        onClick={() => setMostrarSenha(!mostrarSenha)}
                        tabIndex={-1}
                        aria-label={
                          mostrarSenha ? "Ocultar senha" : "Mostrar senha"
                        }
                      >
                        <i
                          className={`bi ${mostrarSenha ? "bi-eye-slash" : "bi-eye"}`}
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
                          Entrando...
                        </>
                      ) : (
                        <>
                          Entrar <i className="bi bi-arrow-right ms-1" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <p className="text-center text-body-secondary small mt-4 mb-0">
                  Não tem uma conta?{" "}
                  <a
                    href="#"
                    className="sge-link fw-semibold text-decoration-none"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/cadastro");
                    }}
                  >
                    Cadastre-se
                  </a>
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
