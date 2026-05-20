import { useState } from "react";
import { useCadastroFormulario } from "../../hooks/auth/useCadastroFormulario";
import CadastroHeader from "./CadastroHeader";
import NomeInput from "./NomeInput";
import EmailInput from "./EmailInput";
import FuncaoSelect from "./FuncaoSelect";
import SenhaInput from "./SenhaInput";
import SenhaConfirmacaoInput from "./SenhaConfirmacaoInput";
import AuthAlerta from "./AuthAlerta";
import CadastroFooter from "./CadastroFooter";

export default function CadastroFormulario() {
  const {
    form,
    carregando,
    erro,
    sucesso,
    setErro,
    handleChange,
    handleSubmit,
  } = useCadastroFormulario();

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">
          <div className="card sge-login-card shadow-lg border-0">
            <div className="card-body p-4 p-md-5">
              <CadastroHeader />

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
                <AuthAlerta message={erro} onClose={() => setErro("")} />
              )}

              {!sucesso && (
                <form onSubmit={handleSubmit} noValidate>
                  <NomeInput value={form.nome} onChange={handleChange} />

                  <EmailInput
                    value={form.email}
                    onChange={(val) =>
                      handleChange({ target: { name: "email", value: val } })
                    }
                  />

                  <FuncaoSelect value={form.funcao} onChange={handleChange} />

                  <SenhaInput
                    value={form.senha}
                    onChange={(val) =>
                      handleChange({ target: { name: "senha", value: val } })
                    }
                    mostrarSenha={mostrarSenha}
                    toggleSenha={() => setMostrarSenha(!mostrarSenha)}
                  />

                  <SenhaConfirmacaoInput
                    value={form.confirmarSenha}
                    onChange={handleChange}
                    mostrarSenha={mostrarConfirmar}
                    toggleSenha={() => setMostrarConfirmar(!mostrarConfirmar)}
                  />

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

              <CadastroFooter />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
