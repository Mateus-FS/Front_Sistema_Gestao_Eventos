import { useCallback, useEffect, useMemo, useState } from "react";
import { inscricaoService } from "../../services/inscricaoService";

const mensagemErro = (e) => e?.message ?? "Erro desconhecido";

export const useInscricoesAdmin = ({ onAtualizar } = {}) => {
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
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

        setErro(mensagemErro(e));
        setSucesso("");
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

  const salvar = useCallback(async (dados) => {
  setSalvando(true);
  setErro("");
  setSucesso("");

  try {
    await inscricaoService.salvar(dados);
    setSucesso("Inscrição criada!");
    setVersao((v) => v + 1);
    onAtualizar?.();
    return true;
  } catch (e) {
    setErro(mensagemErro(e));
    return false;
  } finally {
    setSalvando(false);
  }
}, [onAtualizar]);

  const confirmar = useCallback(async (id) => {
    setSalvando(true);
    setErro("");
    setSucesso("");

    try {
      await inscricaoService.atualizar(id, { status: "CONFIRMADA" });
      setSucesso("Inscrição confirmada!");
      setVersao((v) => v + 1);
      return true;
    } catch (e) {
      setErro(mensagemErro(e));
      return false;
    } finally {
      setSalvando(false);
    }
  }, []);

  const cancelar = useCallback(async (id) => {
    setSalvando(true);
    setErro("");
    setSucesso("");

    try {
      await inscricaoService.deletar(id);
      setSucesso("Inscrição excluída!");
      setVersao((v) => v + 1);
      onAtualizar?.();
      return true;
    } catch (e) {
      setErro(mensagemErro(e));
      return false;
    } finally {
      setSalvando(false);
    }
  }, [onAtualizar]);

  const marcarPresenca = useCallback(async (id, presente) => {
    setSalvando(true);
    setErro("");
    setSucesso("");

    try {
      await inscricaoService.atualizar(id, { presente });
      setSucesso(presente ? "Presença marcada!" : "Presença desmarcada!");
      setVersao((v) => v + 1);
      return true;
    } catch (e) {
      setErro(mensagemErro(e));
      return false;
    } finally {
      setSalvando(false);
    }
  }, []);

  const listaFiltrada = useMemo(() => {
    return lista.filter((i) => {
      const okEvento = filtroEvento
        ? String(i.eventoId ?? i.evento?.id ?? "") === String(filtroEvento)
        : true;

      const okUsuario = filtroUsuario
        ? String(i.usuarioId ?? i.usuario?.id ?? "").includes(filtroUsuario) ||
          (i.usuarioNome ?? i.usuario?.nome ?? "")
            .toLowerCase()
            .includes(filtroUsuario.toLowerCase())
        : true;

      return okEvento && okUsuario;
    });
  }, [lista, filtroEvento, filtroUsuario]);

  return {
    lista: listaFiltrada,
    listaTotal: lista,
    carregando,
    salvando,
    erro,
    setErro,
    sucesso,
    setSucesso,
    filtroEvento,
    setFiltroEvento,
    filtroUsuario,
    setFiltroUsuario,
    salvar,
    confirmar,
    cancelar,
    marcarPresenca,
    recarregar,
  };
};