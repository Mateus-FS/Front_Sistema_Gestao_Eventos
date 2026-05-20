import { useCallback, useState } from "react";

export const useModalEdicao = () => {
  const [modal, setModal] = useState(null);

  const abrirNovo = useCallback(() => {
    setModal({ tipo: "novo" });
  }, []);

  const abrirEdicao = useCallback((item) => {
    setModal({ tipo: "editar", item });
  }, []);

  const fechar = useCallback(() => {
    setModal(null);
  }, []);

  const estaAberto = Boolean(modal);
  const estaEditando = modal?.tipo === "editar";
  const itemAtual = modal?.item ?? {};

  return {
    estaAberto,
    estaEditando,
    itemAtual,
    abrirNovo,
    abrirEdicao,
    fechar,
  };
};