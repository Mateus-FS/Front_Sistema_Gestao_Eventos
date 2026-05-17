import { useCallback, useEffect, useState } from "react";
import { eventos, inscricoes, notificacoes } from "../services/apiService";

function normalizar(data) {
  return Array.isArray(data) ? data : (data.content ?? []);
}

export function useDashboard(usuarioId) {
  const [abaAtiva, setAbaAtiva] = useState("eventos");
  const [listaEventos, setListaEventos] = useState([]);
  const [minhasInscricoes, setMinhasInscricoes] = useState([]);
  const [listaNotificacoes, setListaNotificacoes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro("");
      try {
        if (abaAtiva === "eventos") {
          const data = await eventos.listar();
          setListaEventos(normalizar(data));
        } else if (abaAtiva === "inscricoes") {
          const data = await inscricoes.listarPorUsuario(usuarioId);
          setMinhasInscricoes(normalizar(data));
        } else if (abaAtiva === "notificacoes") {
          const data = await notificacoes.listar();
          setListaNotificacoes(normalizar(data));
        }
      } catch (err) {
        setErro(err.message || "Erro ao carregar dados.");
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [abaAtiva, usuarioId, versao]);

  const atualizar = useCallback(() => setVersao((v) => v + 1), []);

  return {
    abaAtiva,
    setAbaAtiva,
    listaEventos,
    minhasInscricoes,
    listaNotificacoes,
    carregando,
    erro,
    setErro,
    atualizar,
  };
}
