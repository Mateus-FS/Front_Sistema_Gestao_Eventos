import { useState } from "react";

export const useConfirmacao = () => {
  const [estado, setEstado] = useState(null);

  const confirmar = (id, mensagem) => {
    setEstado({ id, mensagem });
  };

  const cancelar = () => {
    setEstado(null);
  };

  return {
    aberto: !!estado,
    id: estado?.id,
    mensagem: estado?.mensagem,
    confirmar,
    cancelar,
  };
};
