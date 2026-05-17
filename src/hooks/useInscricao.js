import { useCallback, useEffect, useRef, useState } from "react";
import { inscricoes } from "../services/apiService";

export function useInscricao(usuarioId, onAtualizar) {
  const [sucesso, setSucesso] = useState("");
  const [erro, setErro] = useState("");
  const timerRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const inscrever = useCallback(
    async (eventoId) => {
      setSucesso("");
      setErro("");
      try {
        await inscricoes.salvar({ usuarioId, eventoId });
        setSucesso("Inscrição realizada com sucesso!");
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setSucesso(""), 6000);
      } catch (err) {
        setErro(err.message || "Erro ao realizar inscrição.");
      }
    },
    [usuarioId],
  );

  const desinscrever = useCallback(
    async (inscricaoId) => {
      setSucesso("");
      setErro("");
      try {
        await inscricoes.deletar(inscricaoId);
        setSucesso("Inscrição cancelada com sucesso!");
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setSucesso(""), 6000);
        onAtualizar?.(); // ← recarrega a lista automaticamente
      } catch (err) {
        setErro(err.message || "Erro ao cancelar inscrição.");
      }
    },
    [onAtualizar],
  );

  return { sucesso, setSucesso, erro, setErro, inscrever, desinscrever };
}
