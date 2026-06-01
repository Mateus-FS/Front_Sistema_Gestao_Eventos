import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "./useAuth";
import { decodificarUsuario } from "../../utils/autenticacao";

export function useLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ email, senha }) => login(email, senha),

    onSuccess: (data) => {
      toast.success("Login realizado com sucesso!");
      const decoded = decodificarUsuario(data.token);
      const role = decoded?.role;
      navigate(role === "ADMIN" ? "/admin/dashboard" : "/dashboard", { replace: true });
    },

    onError: (error) => {
      const status = error?.response?.status;
      if (status === 401) toast.error("Credenciais inválidas.");
      else if (status === 403) toast.error("Usuário sem permissão.");
      else if (status >= 500) toast.error("Erro interno.");
      else toast.error("Erro ao realizar login.");
    },
  });
}