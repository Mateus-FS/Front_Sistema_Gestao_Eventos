import { useCallback, useEffect, useState } from "react";
import { notificacaoService } from "../../services/notificacaoService";
import { extrairLista } from "../../utils/formatacoes";

const mensagemErro = (e) =>
  e?.message ?? "Erro ao carregar notificações.";

export const useNotificacoesUsuario = () => {
  const [listaNotificacoes, setListaNotificacoes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    let ativo = true;

    const carregar = async () => {
      setCarregando(true);
      setErro("");

      try {
        const data = await notificacaoService.listar();

        if (!ativo) return;

        setListaNotificacoes(extrairLista(data));
      } catch (e) {
        if (!ativo) return;

        setErro(mensagemErro(e));
      } finally {
        if (ativo) setCarregando(false);
      }
    };

    carregar();

    return () => {
      ativo = false;
    };
  }, [versao]);

  const recarregar = useCallback(() => {
    setVersao((v) => v + 1);
  }, []);

  return { listaNotificacoes, carregando, erro, setErro, recarregar };
};