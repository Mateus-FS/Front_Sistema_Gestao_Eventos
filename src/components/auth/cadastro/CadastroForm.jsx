import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCadastro } from "../../../hooks/auth/useCadastro";
import { cadastroSchema } from "../../../utils/cadastroSchema";
import EmailInput from "../../shared/EmailInput";
import FuncaoSelect from "../../shared/FuncaoSelect";
import NomeInput from "../../shared/NomeInput";
import SenhaConfirmacaoInput from "../../shared/SenhaConfirmacaoInput";
import SenhaInput from "../../shared/SenhaInput";
import CadastroFooter from "./CadastroFooter";
import CadastroHeader from "./CadastroHeader";

export default function CadastroForm() {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  const { mutate, isPending } = useCadastro();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(cadastroSchema),
  });

  const onSubmit = (data) => {
    mutate({
      nome: data.nome,
      funcao: data.funcao,
      email: data.email,
      senha: data.senha,
    });
  };

  const onInvalid = () => {
    toast.warning("Preencha todos os campos obrigatórios.");
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">
          <div className="sge-bg-shape sge-bg-shape-1" />
          <div className="sge-bg-shape sge-bg-shape-2" />
          <div className="sge-bg-shape sge-bg-shape-3" />

          <div className="card sge-login-card shadow-lg border-0">
            <div className="card-body p-4 p-md-5">
              <CadastroHeader />
              <hr className="sge-divider mb-4" />

              <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
                <NomeInput
                  registration={register("nome")}
                  error={errors.nome?.message}
                />

                <FuncaoSelect
                  registration={register("funcao")}
                  error={errors.funcao?.message}
                />

                <EmailInput
                  registration={register("email")}
                  error={errors.email?.message}
                />

                <SenhaInput
                  registration={register("senha")}
                  error={errors.senha?.message}
                  mostrarSenha={mostrarSenha}
                  toggleSenha={() => setMostrarSenha(!mostrarSenha)}
                  autoComplete="new-password"
                />

                <SenhaConfirmacaoInput
                  registration={register("confirmarSenha")}
                  error={errors.confirmarSenha?.message}
                  mostrarSenha={mostrarConfirmar}
                  toggleSenha={() => setMostrarConfirmar(!mostrarConfirmar)}
                />

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary sge-btn-login"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        />
                        Cadastrando...
                      </>
                    ) : (
                      <>Criar conta <i className="bi bi-arrow-right ms-1" /></>
                    )}
                  </button>
                </div>
              </form>

              <CadastroFooter />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}