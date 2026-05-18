export const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validarCadastro = (form) => {
  const { nome, email, senha, confirmarSenha, funcao } = form;

  if (!nome || !email || !senha || !funcao) return "Preencha todos os campos.";

  if (nome.length < 3) return "O nome deve ter pelo menos 3 caracteres.";

  if (!validarEmail(email)) return "Informe um e-mail válido.";

  if (senha.length < 4) return "A senha deve ter pelo menos 4 caracteres.";

  if (senha !== confirmarSenha) return "As senhas não coincidem.";

  return null;
};
