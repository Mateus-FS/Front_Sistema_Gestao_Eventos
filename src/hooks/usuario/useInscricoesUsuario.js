import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { inscricaoService } from "../../services/inscricaoService";
import { extrairLista } from "../../utils/paginacao";

export const useInscricoesUsuario = (usuarioId) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["inscricoes", usuarioId],
    queryFn: () => inscricaoService.listarPorUsuario(usuarioId),
    enabled: !!usuarioId,
  });

  const invalidar = () =>
    queryClient.invalidateQueries({ queryKey: ["inscricoes", usuarioId] });

  const { mutateAsync: inscrever, isPending: salvandoInscrever } = useMutation({
    mutationFn: (eventoId) => inscricaoService.salvar({ usuarioId, eventoId }),
    onSuccess: () => {
      toast.success("Inscrição realizada com sucesso!");
      invalidar();
    },
    onError: (error) => {
      const status = error.response?.status;
      const data = error.response?.data;
      const mensagem = typeof data === "string" ? data : data?.message;

      if (status === 409) {
        toast.error(mensagem || "Você já está inscrito neste evento.");
        return;
      }
      if (status === 400) {
        toast.error(mensagem || "Erro de validação.");
        return;
      }
      toast.error("Erro ao realizar inscrição.");
    },
  });

  const { mutateAsync: desinscrever, isPending: salvandoCancelar } =
    useMutation({
      mutationFn: (inscricaoId) => inscricaoService.deletar(inscricaoId),
      onSuccess: () => {
        toast.success("Inscrição cancelada com sucesso!");
        invalidar();
      },
      onError: (error) => {
        const status = error.response?.status;
        const data = error.response?.data;
        const mensagem = typeof data === "string" ? data : data?.message;

        if (status === 400 || status === 409) {
          toast.error(mensagem || "Erro ao cancelar inscrição.");
          return;
        }
        toast.error("Erro ao cancelar inscrição.");
      },
    });

  return {
    lista: extrairLista(data),
    carregando: isLoading,
    salvando: salvandoInscrever || salvandoCancelar,
    erro: error ? "Erro ao carregar inscrições" : undefined,
    inscrever,
    desinscrever,
    recarregar: refetch,
  };
};
