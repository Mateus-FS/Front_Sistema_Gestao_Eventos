import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../services/authService";
import "../styles/Login.css";

export default function RecuperarSenha() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Se vier ?token=xxx na URL, já vai direto para a etapa de redefinir
  const tokenInicial = searchParams.get("token") || "";

  const [etapa, setEtapa] = useState(tokenInicial ? "redefinir" : "solicitar");

  // Etapa 1 – solicitar
  const [email, setEmail] = useState("");

  // Etapa 2 – redefinir
  const [token, setToken] = useState(tokenInicial);
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarNova, setMostrarNova] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  // ── Etapa 1: solicitar e-mail ──────────────────────────
  const handleSolicitar = async (e) => {
    e.preventDefault();
    if (!email) { setErro("Informe seu e-mail."); return; }
    setErro("");
    setCarregando(true);
    try {
      await authService.solicitarRecuperacao(email);
      setSucesso(
        "Se este e-mail estiver cadastrado, você receberá as instruções em breve."
      );
    } catch (err) {
      setErro(err.message || "Erro ao solicitar recuperação. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  // ── Etapa 2: redefinir senha ───────────────────────────
  const handleRedefinir = async (e) => {
    e.preventDefault();
    if (!token) { setErro("Informe o token recebido por e-mail."); return; }
    if (novaSenha.length < 4) { setErro("A senha deve ter pelo menos 4 caracteres."); return; }
    if (novaSenha !== confirmarSenha) { setErro("As senhas não coincidem."); return; }
    setErro("");
    setCarregando(true);
    try {
      await authService.redefinirSenha(token, novaSenha);
      setSucesso("Senha redefinida com sucesso! Redirecionando para o login...");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setErro(err.message || "Token inválido ou expirado. Tente novamente.");
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

                {/* Header */}
                <div className="text-center mb-4">
                  <div className="sge-logo-circle mx-auto mb-3">
                    <i className={`bi ${etapa === "solicitar" ? "bi-shield-lock" : "bi-key"} fs-4`} />
                  </div>
                  <h4 className="fw-bold text-body-emphasis mb-1">
                    {etapa === "solicitar" ? "Recuperar senha" : "Nova senha"}
                  </h4>
                  <p className="text-body-secondary small">
                    {etapa === "solicitar"
                      ? "Informe seu e-mail para receber as instruções"
                      : "Crie uma nova senha para sua conta"}
                  </p>
                </div>

                <hr className="sge-divider mb-4" />

                {/* Indicador de etapas */}
                <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
                  <div className={`sge-etapa-dot ${etapa === "solicitar" ? "sge-etapa-ativa" : "sge-etapa-concluida"}`}>
                    {etapa === "redefinir" ? <i className="bi bi-check-lg" /> : "1"}
                  </div>
                  <div className={`sge-etapa-linha ${etapa === "redefinir" ? "sge-etapa-linha-ativa" : ""}`} />
                  <div className={`sge-etapa-dot ${etapa === "redefinir" ? "sge-etapa-ativa" : "sge-etapa-inativa"}`}>
                    2
                  </div>
                </div>

                {/* Sucesso */}
                {sucesso && (
                  <div className="alert alert-success py-2 small text-center" role="alert">
                    <i className="bi bi-check-circle-fill me-2" />
                    {sucesso}
                  </div>
                )}

                {/* Erro */}
                {erro && (
                  <div className="alert alert-danger alert-dismissible fade show py-2 small" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2" />
                    {erro}
                    <button type="button" className="btn-close" onClick={() => setErro("")} aria-label="Fechar" />
                  </div>
                )}

                {/* ── ETAPA 1: Solicitar ────────────────── */}
                {etapa === "solicitar" && !sucesso && (
                  <form onSubmit={handleSolicitar} noValidate>
                    <div className="mb-4">
                      <label htmlFor="email" className="form-label fw-semibold small text-body-emphasis">
                        E-mail cadastrado
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
                          onChange={(e) => { setEmail(e.target.value); setErro(""); }}
                          required
                          autoFocus
                          autoComplete="email"
                        />
                      </div>
                      <div className="form-text small text-body-secondary mt-1">
                        <i className="bi bi-info-circle me-1" />
                        Enviaremos um link de recuperação para este e-mail.
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
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            Enviar instruções <i className="bi bi-send ms-1" />
                          </>
                        )}
                      </button>
                    </div>

                    {/* Link para ir direto à etapa 2 (caso já tenha o token) */}
                    <p className="text-center text-body-secondary small mt-3 mb-0">
                      Já tem o token?{" "}
                      <button
                        type="button"
                        className="btn btn-link sge-link fw-semibold text-decoration-none p-0 small"
                        onClick={() => { setErro(""); setSucesso(""); setEtapa("redefinir"); }}
                      >
                        Inserir aqui
                      </button>
                    </p>
                  </form>
                )}

                {/* ── ETAPA 2: Redefinir ────────────────── */}
                {etapa === "redefinir" && !sucesso && (
                  <form onSubmit={handleRedefinir} noValidate>

                    {/* Token */}
                    <div className="mb-3">
                      <label htmlFor="token" className="form-label fw-semibold small text-body-emphasis">
                        Token de recuperação
                      </label>
                      <div className="input-group">
                        <span className="input-group-text sge-input-addon">
                          <i className="bi bi-key" />
                        </span>
                        <input
                          type="text"
                          className="form-control sge-input"
                          id="token"
                          placeholder="Cole o token recebido por e-mail"
                          value={token}
                          onChange={(e) => { setToken(e.target.value); setErro(""); }}
                          required
                          autoFocus={!tokenInicial}
                          autoComplete="off"
                        />
                      </div>
                    </div>

                    {/* Nova senha */}
                    <div className="mb-3">
                      <label htmlFor="novaSenha" className="form-label fw-semibold small text-body-emphasis">
                        Nova senha
                      </label>
                      <div className="input-group">
                        <span className="input-group-text sge-input-addon">
                          <i className="bi bi-lock" />
                        </span>
                        <input
                          type={mostrarNova ? "text" : "password"}
                          className="form-control sge-input"
                          id="novaSenha"
                          placeholder="••••••••"
                          value={novaSenha}
                          onChange={(e) => { setNovaSenha(e.target.value); setErro(""); }}
                          required
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className="btn sge-toggle-pw input-group-text"
                          onClick={() => setMostrarNova(!mostrarNova)}
                          tabIndex={-1}
                        >
                          <i className={`bi ${mostrarNova ? "bi-eye-slash" : "bi-eye"}`} />
                        </button>
                      </div>
                    </div>

                    {/* Confirmar senha */}
                    <div className="mb-4">
                      <label htmlFor="confirmarSenha" className="form-label fw-semibold small text-body-emphasis">
                        Confirmar nova senha
                      </label>
                      <div className="input-group">
                        <span className="input-group-text sge-input-addon">
                          <i className="bi bi-lock-fill" />
                        </span>
                        <input
                          type={mostrarConfirmar ? "text" : "password"}
                          className="form-control sge-input"
                          id="confirmarSenha"
                          placeholder="••••••••"
                          value={confirmarSenha}
                          onChange={(e) => { setConfirmarSenha(e.target.value); setErro(""); }}
                          required
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className="btn sge-toggle-pw input-group-text"
                          onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                          tabIndex={-1}
                        >
                          <i className={`bi ${mostrarConfirmar ? "bi-eye-slash" : "bi-eye"}`} />
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
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            Redefinir senha <i className="bi bi-arrow-right ms-1" />
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-center text-body-secondary small mt-3 mb-0">
                      Não recebeu o token?{" "}
                      <button
                        type="button"
                        className="btn btn-link sge-link fw-semibold text-decoration-none p-0 small"
                        onClick={() => { setErro(""); setSucesso(""); setToken(""); setEtapa("solicitar"); }}
                      >
                        Reenviar e-mail
                      </button>
                    </p>
                  </form>
                )}

                {/* Voltar ao login */}
                <p className="text-center text-body-secondary small mt-4 mb-0">
                  <button
                    type="button"
                    className="btn btn-link sge-link text-decoration-none p-0 small"
                    onClick={() => navigate("/login")}
                  >
                    <i className="bi bi-arrow-left me-1" />
                    Voltar ao login
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