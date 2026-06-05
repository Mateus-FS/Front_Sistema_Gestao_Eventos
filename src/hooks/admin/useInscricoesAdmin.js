import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { inscricaoService } from "../../services/inscricaoService";
import { extrairLista } from "../../utils/paginacao";

export const useInscricoesAdmin = ({ onAtualizar } = {}) => {
  const queryClient = useQueryClient();
  const [filtroEvento, setFiltroEvento] = useState("");
  const [filtroUsuario, setFiltroUsuario] = useState("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-inscricoes"],
    queryFn: () => inscricaoService.listar(0, 200),
  });

  const invalidar = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-inscricoes"] });
    onAtualizar?.();
  };

  const { mutateAsync: salvar, isPending: salvandoSalvar } = useMutation({
    mutationFn: (dados) => inscricaoService.salvar(dados),
    onSuccess: () => {
      toast.success("Inscrição criada!");
      invalidar();
    },
    onError: (error) => {
      const mensagem =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || error.message || "Ocorreu um erro.";
      toast.error(mensagem);
    },
  });

  const { mutateAsync: confirmar, isPending: salvandoConfirmar } = useMutation({
    mutationFn: (id) =>
      inscricaoService.atualizar(id, { status: "CONFIRMADA" }),
    onSuccess: () => {
      toast.success("Inscrição confirmada!");
      queryClient.invalidateQueries({ queryKey: ["admin-inscricoes"] });
    },
    onError: (error) => {
      const mensagem =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || error.message || "Ocorreu um erro.";
      toast.error(mensagem);
    },
  });

  const { mutateAsync: cancelar, isPending: salvandoCancelar } = useMutation({
    mutationFn: (id) => inscricaoService.deletar(id),
    onSuccess: () => {
      toast.success("Inscrição excluída!");
      invalidar();
    },
    onError: (error) => {
      const mensagem =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || error.message || "Ocorreu um erro.";
      toast.error(mensagem);
    },
  });

  const { mutateAsync: marcarPresenca, isPending: salvandoPresenca } =
    useMutation({
      mutationFn: ({ id, presente }) =>
        inscricaoService.atualizar(id, { presente }),
      onSuccess: (_, { presente }) => {
        const mensagem = presente
          ? "Presença marcada!"
          : "Presença desmarcada!";
        toast.success(mensagem);
        queryClient.invalidateQueries({ queryKey: ["admin-inscricoes"] });
      },
    onError: (error) => {
      const mensagem =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || error.message || "Ocorreu um erro.";
      toast.error(mensagem);
    },
    });

  const listaTotal = extrairLista(data);

  const lista = useMemo(() => {
    return listaTotal.filter((i) => {
      const okEvento = filtroEvento
        ? String(i.eventoId ?? i.evento?.id ?? "") === String(filtroEvento)
        : true;
      const okUsuario = filtroUsuario
        ? String(i.usuarioId ?? i.usuario?.id ?? "").includes(filtroUsuario) ||
        (i.usuarioNome ?? i.usuario?.nome ?? "")
          .toLowerCase()
          .includes(filtroUsuario.toLowerCase())
        : true;
      return okEvento && okUsuario;
    });
  }, [listaTotal, filtroEvento, filtroUsuario]);

  return {
    lista,
    listaTotal,
    carregando: isLoading,
    salvando:
      salvandoSalvar ||
      salvandoConfirmar ||
      salvandoCancelar ||
      salvandoPresenca,
    filtroEvento,
    setFiltroEvento,
    filtroUsuario,
    setFiltroUsuario,
    salvar,
    confirmar,
    cancelar,
    marcarPresenca: (id, presente) => marcarPresenca({ id, presente }),
    recarregar: refetch,
  };
};
