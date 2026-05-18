import { useCallback, useEffect, useRef, useState } from "react";
import { inscricaoService } from "../../services/inscricaoService";
import { normalizar } from "../../utils/formatacoes";

export const useInscricoesUsuario = (usuarioId) => {
  const [minhasInscricoes, setMinhasInscricoes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [versao, setVersao] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro("");
      try {
        const data = await inscricaoService.listarPorUsuario(usuarioId);
        setMinhasInscricoes(normalizar(data));
      } catch (err) {
        setErro(err.message || "Erro ao carregar inscrições.");
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [usuarioId, versao]);

  const recarregar = useCallback(() => setVersao((v) => v + 1), []);

  const mostrarSucesso = useCallback((msg) => {
    setSucesso(msg);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setSucesso(""), 6000);
  }, []);

  const inscrever = useCallback(
    async (eventoId) => {
      setSucesso("");
      setErro("");
      try {
        await inscricaoService.salvar({ usuarioId, eventoId });
        mostrarSucesso("Inscrição realizada com sucesso!");
        recarregar();
      } catch (err) {
        setErro(err.message || "Erro ao realizar inscrição.");
      }
    },
    [usuarioId, recarregar, mostrarSucesso],
  );

  const desinscrever = useCallback(
    async (inscricaoId) => {
      setSucesso("");
      setErro("");
      try {
        await inscricaoService.deletar(inscricaoId);
        mostrarSucesso("Inscrição cancelada com sucesso!");
        recarregar();
      } catch (err) {
        setErro(err.message || "Erro ao cancelar inscrição.");
      }
    },
    [recarregar, mostrarSucesso],
  );

  return {
    minhasInscricoes,
    carregando,
    erro,
    setErro,
    sucesso,
    setSucesso,
    inscrever,
    desinscrever,
    recarregar,
  };
};
