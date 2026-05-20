import { useCallback, useEffect, useState } from "react";
import { perfilService } from "../../services/perfilService";
import { usuarioService } from "../../services/usuarioService";

const mensagemErro = (e) => e?.message ?? "Erro desconhecido";

export const useUsuariosAdmin = () => {
  const [lista, setLista] = useState([]);
  const [perfis, setPerfis] = useState([]);
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
        const [resUsuarios, resPerfis] = await Promise.all([
          usuarioService.listar(0, 100),
          perfilService.listar(0, 100),
        ]);

        if (!ativo) return;

        setLista(resUsuarios?.content ?? resUsuarios ?? []);
        setPerfis(resPerfis?.content ?? resPerfis ?? []);
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

  const atualizar = useCallback(async (id, dados) => {
    setSalvando(true);
    setErro("");
    setSucesso("");

    try {
      await usuarioService.atualizar(id, dados);

      setSucesso("Usuário atualizado!");
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
      await usuarioService.deletar(id);

      setSucesso("Usuário removido!");
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
    perfis,
    carregando,
    salvando,
    erro,
    setErro,
    sucesso,
    setSucesso,
    atualizar,
    deletar,
    recarregar,
  };
};