import { z } from "zod";

export const notificacaoSchema = z
  .object({
    mensagem: z.string().min(3, "A mensagem deve ter pelo menos 3 caracteres."),
    destinatario: z.enum(["todos", "especifico"]),
    usuarioId: z.string().optional(),
  })
  .refine(
    (data) => data.destinatario !== "especifico" || !!data.usuarioId,
    { message: "Selecione um usuário.", path: ["usuarioId"] }
  );