import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import "../styles/RecuperarSenha.css";

export default function RecuperarSenhaPage() {
  const navigate = useNavigate();

  const [etapa, setEtapa] = useState("solicitar");

  // Etapa 1
  const [email, setEmail] = useState("");

  // Token retornado pelo backend — exibido na tela
  const [tokenGerado, setTokenGerado] = useState("");

  // Etapa 2
  const [token, setToken] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarNova, setMostrarNova] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  // ── Etapa 1: solicitar ──────────────────────────────────────
  const handleSolicitar = async (e) => {
    e.preventDefault();
    if (!email) { setErro("Informe seu e-mail."); return; }
    setErro("");
    setCarregando(true);
    try {
      const data = await authService.solicitarRecuperacao(email);
      // Backend devolve { token: "ABC12345" }
      setTokenGerado(data.token);
      setToken(data.token); // já preenche o campo da etapa 2
      setEtapa("redefinir");
    } catch (err) {
      const msg = err.response?.data?.message
        || err.response?.data
        || err.message
        || "E-mail não encontrado.";
      setErro(typeof msg === "string" ? msg : "Erro ao solicitar recuperação.");
    } finally {
      setCarregando(false);
    }
  };

  // ── Etapa 2: redefinir ──────────────────────────────────────
  const handleRedefinir = async (e) => {
    e.preventDefault();
    if (!token) { setErro("O token não pode estar vazio."); return; }
    if (novaSenha.length < 4) { setErro("A senha deve ter pelo menos 4 caracteres."); return; }
    if (novaSenha !== confirmarSenha) { setErro("As senhas não coincidem."); return; }
    setErro("");
    setCarregando(true);
    try {
      await authService.redefinirSenha(token, novaSenha);
      setSucesso("Senha redefinida com sucesso! Redirecionando para o login...");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      const msg = err.response?.data?.message
        || err.response?.data
        || err.message
        || "Token inválido ou expirado.";
      setErro(typeof msg === "string" ? msg : "Erro ao redefinir senha.");
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
                      ? "Informe seu e-mail para gerar o token"
                      : "Use o token abaixo para criar uma nova senha"}
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

                {/* Sucesso final */}
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

                {/* ── ETAPA 1: Solicitar ──────────────── */}
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
                            Gerando token...
                          </>
                        ) : (
                          <>Gerar token <i className="bi bi-send ms-1" /></>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {/* ── ETAPA 2: Token gerado + Redefinir ── */}
                {etapa === "redefinir" && !sucesso && (
                  <form onSubmit={handleRedefinir} noValidate>

                    {/* Exibe o token gerado com destaque */}
                    {tokenGerado && (
                      <div className="sge-token-box mb-4">
                        <p className="small text-body-secondary mb-1">
                          <i className="bi bi-info-circle me-1" />
                          Token gerado — já preenchido abaixo:
                        </p>
                        <div className="sge-token-valor">
                          {tokenGerado}
                        </div>
                      </div>
                    )}

                    {/* Campo token (já vem preenchido) */}
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
                          placeholder="Token"
                          value={token}
                          onChange={(e) => { setToken(e.target.value); setErro(""); }}
                          required
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
                          autoFocus
                          autoComplete="new-password"
                        />
                        <button type="button" className="btn sge-toggle-pw input-group-text"
                          onClick={() => setMostrarNova(!mostrarNova)} tabIndex={-1}>
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
                        <button type="button" className="btn sge-toggle-pw input-group-text"
                          onClick={() => setMostrarConfirmar(!mostrarConfirmar)} tabIndex={-1}>
                          <i className={`bi ${mostrarConfirmar ? "bi-eye-slash" : "bi-eye"}`} />
                        </button>
                      </div>
                    </div>

                    <div className="d-grid">
                      <button type="submit" className="btn btn-primary sge-btn-login" disabled={carregando}>
                        {carregando ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                            Salvando...
                          </>
                        ) : (
                          <>Redefinir senha <i className="bi bi-arrow-right ms-1" /></>
                        )}
                      </button>
                    </div>

                    <p className="text-center text-body-secondary small mt-3 mb-0">
                      E-mail errado?{" "}
                      <button type="button"
                        className="btn btn-link sge-link fw-semibold text-decoration-none p-0 small"
                        onClick={() => { setErro(""); setEtapa("solicitar"); setTokenGerado(""); setToken(""); }}>
                        Tentar novamente
                      </button>
                    </p>
                  </form>
                )}

                {/* Voltar ao login */}
                <p className="text-center text-body-secondary small mt-4 mb-0">
                  <button type="button"
                    className="btn btn-link sge-link text-decoration-none p-0 small"
                    onClick={() => navigate("/login")}>
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