import { useCallback, useEffect, useRef, useState } from "react";
import { inscricaoService } from "../../services/inscricaoService";
import { extrairLista } from "../../utils/formatacoes";

const mensagemErro = (e, padrao) => e?.message ?? padrao;

export const useInscricoesUsuario = (usuarioId) => {
  const [minhasInscricoes, setMinhasInscricoes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [versao, setVersao] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (!usuarioId) return;

    let ativo = true;

    const carregar = async () => {
      setCarregando(true);
      setErro("");

      try {
        const data = await inscricaoService.listarPorUsuario(usuarioId);

        if (!ativo) return;

        setMinhasInscricoes(extrairLista(data));
      } catch (e) {
        if (!ativo) return;

        setErro(
          mensagemErro(e, "Erro ao carregar inscrições."),
        );
        setSucesso("");
      } finally {
        if (ativo) setCarregando(false);
      }
    };

    carregar();

    return () => {
      ativo = false;
    };
  }, [usuarioId, versao]);

  const recarregar = useCallback(() => {
    setVersao((v) => v + 1);
  }, []);

  const mostrarSucesso = useCallback((msg) => {
    setSucesso(msg);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setSucesso(""), 6000);
  }, []);

  const inscrever = useCallback(
    async (eventoId) => {
      setSalvando(true);
      setSucesso("");
      setErro("");

      try {
        await inscricaoService.salvar({ usuarioId, eventoId });
        mostrarSucesso("Inscrição realizada com sucesso!");
        recarregar();
      } catch (e) {
        setErro(
          mensagemErro(e, "Erro ao realizar inscrição."),
        );
      } finally {
        setSalvando(false);
      }
    },
    [usuarioId, recarregar, mostrarSucesso],
  );

  const desinscrever = useCallback(
    async (inscricaoId) => {
      setSalvando(true);
      setSucesso("");
      setErro("");

      try {
        await inscricaoService.deletar(inscricaoId);
        mostrarSucesso("Inscrição cancelada com sucesso!");
        recarregar();
      } catch (e) {
        setErro(
          mensagemErro(e, "Erro ao cancelar inscrição."),
        );
      } finally {
        setSalvando(false);
      }
    },
    [recarregar, mostrarSucesso],
  );

  return {
    minhasInscricoes,
    carregando,
    salvando,
    erro,
    setErro,
    sucesso,
    setSucesso,
    inscrever,
    desinscrever,
    recarregar,
  };
};