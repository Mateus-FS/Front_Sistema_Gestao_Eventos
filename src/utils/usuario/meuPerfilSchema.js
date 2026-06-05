// import { z } from "zod";

// export const MeuPerfilSchema = z
//   .object({
//     nome: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
//     funcao: z.string().min(1, "Selecione uma função."),
//     senha: z.string().min(4, "A senha deve ter pelo menos 4 caracteres."),
//     confirmarSenha: z.string().min(4, "A confirmação de senha deve ter pelo menos 4 caracteres."),
//   })
//   .refine(
//     (data) => data.senha === data.confirmarSenha,
//     { message: "As senhas não coincidem.", path: ["confirmarSenha"] }
//   );

import { z } from "zod";

export const MeuPerfilSchema = z
  .object({
    nome: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
    funcao: z.string().min(1, "Selecione uma função."),
    senha: z.string().min(4, "A senha deve ter pelo menos 4 caracteres.").or(z.literal("")).optional(),
    confirmarSenha: z.string().optional(),
  })
  .refine(
    (data) => !data.senha || data.senha === data.confirmarSenha,
    { message: "As senhas não coincidem.", path: ["confirmarSenha"] }
  );