import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usuarioService } from "../../services/usuarioService";
import { validarCadastro } from "../../utils/validacoes";

const PERFIL_USER_ID = 2;

export function useCadastroFormulario() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    funcao: "",
  });
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    if (!sucesso) return;
    const timer = setTimeout(() => navigate("/login"), 2000);
    return () => clearTimeout(timer);
  }, [sucesso, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErro("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const erroValidacao = validarCadastro(form);
    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }

    setCarregando(true);
    setErro("");
    try {
      await usuarioService.salvar({
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        funcao: form.funcao,
        perfisIds: [PERFIL_USER_ID],
      });
      setSucesso(true);
    } catch (err) {
      setErro(err.message || "Erro ao realizar cadastro. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return {
    form,
    carregando,
    erro,
    sucesso,
    setErro,
    handleChange,
    handleSubmit,
  };
}
