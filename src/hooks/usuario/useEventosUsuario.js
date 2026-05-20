import { useCallback, useEffect, useState } from "react";
import { eventoService } from "../../services/eventoService";
import { extrairLista } from "../../utils/formatacoes";

const mensagemErro = (e) =>
  e?.message ?? "Erro ao carregar eventos.";

export const useEventosUsuario = () => {
  const [listaEventos, setListaEventos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    let ativo = true;

    const carregar = async () => {
      setCarregando(true);
      setErro("");

      try {
        const data = await eventoService.listar(0, 100);

        if (!ativo) return;

        setListaEventos(extrairLista(data));
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

  return { listaEventos, carregando, erro, setErro, recarregar };
};