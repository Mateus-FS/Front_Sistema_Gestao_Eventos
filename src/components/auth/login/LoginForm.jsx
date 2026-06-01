import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLogin } from "../../../hooks/auth/useLogin";
import { loginSchema } from "../../../utils/loginSchema";
import EmailInput from "../../shared/EmailInput";
import SenhaInput from "../../shared/SenhaInput";
import LoginFooter from "./LoginFooter";
import LoginHeader from "./LoginHeader";

export default function LoginForm() {
  const navigate = useNavigate();
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const { mutate, isPending } = useLogin();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => mutate(data);

  const onInvalid = () => {
    toast.warning("Preencha todos os campos obrigatórios.");
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">
          <div className="card sge-login-card shadow-lg border-0">
            <div className="card-body p-4 p-md-5">
              <LoginHeader />

              <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
                <EmailInput
                  registration={register("email")}
                  error={errors.email?.message}
                />
                <SenhaInput
                  registration={register("senha")}
                  error={errors.senha?.message}
                  mostrarSenha={mostrarSenha}
                  toggleSenha={() => setMostrarSenha(!mostrarSenha)}
                  onEsqueceuSenha={() => navigate("/recuperar-senha")}
                />

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary sge-btn-login"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                        Entrando...
                      </>
                    ) : (
                      <>Entrar <i className="bi bi-arrow-right ms-1" /></>
                    )}
                  </button>
                </div>
              </form>

              <LoginFooter />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}