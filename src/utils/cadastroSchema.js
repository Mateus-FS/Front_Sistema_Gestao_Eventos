import { z } from "zod";

export const cadastroSchema = z
  .object({
    nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
    email: z.string().email("Informe um e-mail válido."),
    funcao: z.string().min(1, "Selecione uma função."),
    senha: z.string().min(4, "A senha deve ter pelo menos 4 caracteres."),
    confirmarSenha: z.string().min(4, "A confirmação de senha deve ter pelo menos 4 caracteres."),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem.",
    path: ["confirmarSenha"],
  });