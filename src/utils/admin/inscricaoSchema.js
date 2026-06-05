import { z } from "zod";

export const inscricaoSchema = z.object({
  usuarioId: z
    .number({ invalid_type_error: "Selecione um usuário." })
    .nullable()
    .refine((val) => val !== null, "Selecione um usuário."),
  eventoId: z
    .number({ invalid_type_error: "Selecione um evento." })
    .nullable()
    .refine((val) => val !== null, "Selecione um evento."),
});