import { useCallback, useState } from "react";

export const useConfirmacao = () => {
  const [estado, setEstado] = useState(null);

  const confirmar = useCallback((id, mensagem) => {
    setEstado({ id, mensagem });
  }, []);

  const cancelar = useCallback(() => {
    setEstado(null);
  }, []);

  return {
    aberto: Boolean(estado),
    id: estado?.id,
    mensagem: estado?.mensagem,
    confirmar,
    cancelar,
  };
};