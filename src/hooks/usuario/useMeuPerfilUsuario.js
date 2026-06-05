import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usuarioService } from "../../services/usuarioService";
import { useAuth } from "../auth/useAuth";

export const useMeuPerfilUsuario = () => {
  const queryClient = useQueryClient();

  const { user, atualizarNome } = useAuth();

  const { data: usuario, isLoading: carregando } = useQuery({
    queryKey: ["usuario", user.id],
    queryFn: () => usuarioService.buscarPorId(user.id),
    enabled: !!user?.id,
  });

  const invalidar = () =>
    queryClient.invalidateQueries({ queryKey: ["usuario", user.id] });

  const { mutateAsync: salvar, isPending: salvandoSalvar } = useMutation({
    mutationFn: (dados) => usuarioService.atualizar(user.id, dados),
    onSuccess: (data) => {
      toast.success("Perfil atualizado!");
      atualizarNome(data.nome);
      invalidar();
    },
    onError: (error) => {
      if (error.response?.status === 400) {
        const data = error.response.data;
        const mensagem = typeof data === "string" ? data : data?.message || "Erro de validação.";
        toast.error(mensagem);
      }
    },
  });

  return {
    usuario,
    carregando,
    salvando: salvandoSalvar,
    salvar,
  };
};