import { useCallback, useEffect, useState } from "react";
import { notificacaoService } from "../../services/notificacaoService";
import { normalizar } from "../../utils/formatacoes";

export const useNotificacoesUsuario = () => {
  const [listaNotificacoes, setListaNotificacoes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro("");
      try {
        const data = await notificacaoService.listar();
        setListaNotificacoes(normalizar(data));
      } catch (err) {
        setErro(err.message || "Erro ao carregar notificações.");
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [versao]);

  const recarregar = useCallback(() => setVersao((v) => v + 1), []);

  return { listaNotificacoes, carregando, erro, setErro, recarregar };
};
