import { useCallback, useEffect, useState } from "react";
import { inscricaoService } from "../../services/inscricaoService";

export const useInscricoesAdmin = () => {
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [filtroEvento, setFiltroEvento] = useState("");
  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    let ativo = true;

    const carregar = async () => {
      setCarregando(true);
      setErro("");

      try {
        const res = await inscricaoService.listar(0, 200);

        if (!ativo) return;

        setLista(res?.content ?? res ?? []);
      } catch (e) {
        if (!ativo) return;

        setErro(e.message);
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

  const confirmar = useCallback(async (id) => {
    try {
      await inscricaoService.atualizar(id, {
        status: "CONFIRMADA",
      });

      setSucesso("Inscrição confirmada!");

      setVersao((v) => v + 1);

      return true;
    } catch (e) {
      setErro(e.message);

      return false;
    }
  }, []);

  const cancelar = useCallback(async (id) => {
    try {
      await inscricaoService.atualizar(id, {
        status: "CANCELADA",
      });

      setSucesso("Inscrição cancelada!");

      setVersao((v) => v + 1);

      return true;
    } catch (e) {
      setErro(e.message);

      return false;
    }
  }, []);

  const marcarPresenca = useCallback(async (id, presente) => {
    try {
      await inscricaoService.atualizar(id, {
        presente,
      });

      setSucesso(presente ? "Presença marcada!" : "Presença desmarcada!");

      setVersao((v) => v + 1);

      return true;
    } catch (e) {
      setErro(e.message);

      return false;
    }
  }, []);

  const listaFiltrada = lista.filter((i) => {
    const okEvento = filtroEvento
      ? String(i.eventoId ?? i.evento?.id ?? "") === String(filtroEvento)
      : true;

    const okUsuario = filtroUsuario
      ? String(i.usuarioId ?? i.usuario?.id ?? "").includes(filtroUsuario) ||
        (i.usuario?.nome ?? "")
          .toLowerCase()
          .includes(filtroUsuario.toLowerCase())
      : true;

    return okEvento && okUsuario;
  });

  return {
    lista: listaFiltrada,
    listaTotal: lista,
    carregando,
    erro,
    setErro,
    sucesso,
    setSucesso,
    filtroEvento,
    setFiltroEvento,
    filtroUsuario,
    setFiltroUsuario,
    confirmar,
    cancelar,
    marcarPresenca,
    recarregar,
  };
};
