import { useCallback, useEffect, useState } from "react";
import { perfilService } from "../../services/perfilService";

const mensagemErro = (e) => e?.message ?? "Erro desconhecido";

export const usePerfisAdmin = () => {
  const [lista, setLista] = useState([]);
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
        const res = await perfilService.listar(0, 100);

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
      await perfilService.salvar(dados);

      setSucesso("Perfil criado!");
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
      await perfilService.deletar(id);

      setSucesso("Perfil removido!");
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
    carregando,
    salvando,
    erro,
    setErro,
    sucesso,
    setSucesso,
    salvar,
    deletar,
    recarregar,
  };
};