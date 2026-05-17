export function validarCadastro(form) {
  if (!form.nome || !form.email || !form.senha || !form.funcao)
    return "Preencha todos os campos.";
  if (form.nome.length < 3) return "O nome deve ter pelo menos 3 caracteres.";
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  if (!emailValido) return "Informe um e-mail válido.";
  if (form.senha.length < 4) return "A senha deve ter pelo menos 4 caracteres.";
  if (form.senha !== form.confirmarSenha) return "As senhas não coincidem.";
  return null;
}
