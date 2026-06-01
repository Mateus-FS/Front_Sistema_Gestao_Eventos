import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { cadastroService } from "../../services/cadastroService";
import { toast } from "sonner";

export function useCadastro() {
  const { loginComToken } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (dados) => cadastroService.cadastrar(dados),

    onSuccess: (data) => {
      loginComToken(data.token);
      toast.success("Cadastro realizado com sucesso!");
      const role = data.usuario?.role;
      navigate(role === "ADMIN" ? "/admin/dashboard" : "/dashboard", { replace: true });
    },

    onError: (error) => {
      const status = error?.response?.status;
      if (!error?.response) {
        toast.error("Não foi possível conectar ao servidor.");
      } else if (status === 409) {
        toast.error("Este e-mail já está em uso.");
      } else if (status >= 500) {
        toast.error("Erro interno do servidor.");
      } else {
        toast.error("Erro ao realizar cadastro.");
      }
    },
  });
}