import { useCallback, useEffect, useState } from "react";
import { eventoService } from "../../services/eventoService";
import { salaService } from "../../services/salaService";
import { usuarioService } from "../../services/usuarioService";

export const useEventosAdmin = () => {
  const [lista, setLista] = useState([]);
  const [salas, setSalas] = useState([]);
  const [organizadores, setOrganizadores] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [versao, setVersao] = useState(0);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    let ativo = true;

    const carregar = async () => {
      setCarregando(true);
      setErro("");

      try {
        const [resEventos, resSalas, resUsuarios] = await Promise.all([
          eventoService.listar(0, 100),
          salaService.listar(0, 100),
          usuarioService.listar(0, 100),
        ]);

        if (!ativo) return;

        setLista(resEventos?.content ?? resEventos ?? []);
        setSalas(resSalas?.content ?? resSalas ?? []);
        setOrganizadores(resUsuarios?.content ?? resUsuarios ?? []);
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

  const salvar = useCallback(async (dados, id = null) => {
    setSalvando(true);

    try {
      if (id) {
        await eventoService.atualizar(id, dados);
      } else {
        await eventoService.salvar(dados);
      }

      setSucesso(id ? "Evento atualizado!" : "Evento criado!");

      setVersao((v) => v + 1);

      return true;
    } catch (e) {
      setErro(e.message);

      return false;
    } finally {
      setSalvando(false);
    }
  }, []);

  const deletar = useCallback(async (id) => {
    setSalvando(true);

    try {
      await eventoService.deletar(id);

      setSucesso("Evento removido!");

      setVersao((v) => v + 1);

      return true;
    } catch (e) {
      setErro(e.message);

      return false;
    } finally {
      setSalvando(false);
    }
  }, []);

  return {
    lista,
    salas,
    organizadores,
    carregando,
    erro,
    setErro,
    sucesso,
    setSucesso,
    recarregar,
    salvando,
    salvar,
    deletar,
  };
};
