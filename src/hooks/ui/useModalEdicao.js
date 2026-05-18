import { useState } from "react";

export const useModalEdicao = () => {
  const [modal, setModal] = useState(null);

  const abrirNovo = () => {
    setModal({ tipo: "novo" });
  };

  const abrirEdicao = (item) => {
    setModal({
      tipo: "editar",
      item,
    });
  };

  const fechar = () => {
    setModal(null);
  };

  const estaAberto = !!modal;
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
