import { useCallback, useEffect, useState } from "react";
import { notificacaoService } from "../../services/notificacaoService";
import { usuarioService } from "../../services/usuarioService";

const mensagemErro = (e) => e?.message ?? "Erro desconhecido";

export const useNotificacoesAdmin = () => {
  const [lista, setLista] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    let ativo = true;

    const carregar = async () => {
      setCarregando(true);
      setErro("");

      try {
        const [resNotif, resUsuarios] = await Promise.all([
          notificacaoService.listar(0, 100),
          usuarioService.listar(0, 100),
        ]);

        if (!ativo) return;

        setLista(resNotif?.content ?? resNotif ?? []);
        setUsuarios(resUsuarios?.content ?? resUsuarios ?? []);
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

  const enviar = useCallback(async (dados) => {
    setSalvando(true);
    setErro("");
    setSucesso("");

    try {
      await notificacaoService.salvar(dados);

      setSucesso("Notificação enviada!");
      setVersao((v) => v + 1);

      return true;
    } catch (e) {
      setErro(mensagemErro(e));
      return false;
    } finally {
      setSalvando(false);
    }
  }, []);

  const deletar = useCallback(async (id) => {
    setSalvando(true);
    setErro("");
    setSucesso("");

    try {
      await notificacaoService.deletar(id);

      setSucesso("Notificação removida!");
      setVersao((v) => v + 1);

      return true;
    } catch (e) {
      setErro(mensagemErro(e));
      return false;
    } finally {
      setSalvando(false);
    }
  }, []);

  return {
    lista,
    usuarios,
    carregando,
    salvando,
    erro,
    setErro,
    sucesso,
    setSucesso,
    enviar,
    deletar,
    recarregar,
  };
};