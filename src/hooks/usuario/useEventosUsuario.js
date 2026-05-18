import { useCallback, useEffect, useState } from "react";
import { eventoService } from "../../services/eventoService";
import { normalizar } from "../../utils/formatacoes";

export const useEventosUsuario = () => {
  const [listaEventos, setListaEventos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro("");
      try {
        const data = await eventoService.listar();
        setListaEventos(normalizar(data));
      } catch (err) {
        setErro(err.message || "Erro ao carregar eventos.");
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [versao]);

  const recarregar = useCallback(() => setVersao((v) => v + 1), []);

  return { listaEventos, carregando, erro, setErro, recarregar };
};
