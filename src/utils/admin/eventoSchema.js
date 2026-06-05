import { z } from "zod";

export const eventoSchema = (modoEdicao = false) =>
  z
    .object({
      titulo: z.string().min(3, "O título deve ter pelo menos 3 caracteres."),

      descricao: z
        .string()
        .min(5, "A descrição deve ter pelo menos 5 caracteres.")
        .max(300, "A descrição deve ter no máximo 300 caracteres."),

      tipoEvento: z
        .string()
        .refine((val) => ["CURSO", "PALESTRA", "WORKSHOP"].includes(val), {
          message: "Selecione um tipo de evento.",
        }),

      dataInicio: z.string().min(1, "Informe a data de início."),

      dataTermino: z.string().min(1, "Informe a data de término."),

      salaId: z.preprocess(
        (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
        z.union([
          z.number().positive("Selecione uma sala válida."),
          z.null(),
        ]).refine((val) => val !== null, { message: "Selecione uma sala válida." })
      ),

      organizadorId: z.preprocess(
        (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
        z.union([
          z.number().positive("Selecione um organizador válido."),
          z.null(),
        ]).refine((val) => val !== null, { message: "Selecione um organizador válido." })
      ),
    })
    .superRefine((data, ctx) => {
      if (!modoEdicao && data.dataInicio && new Date(data.dataInicio) < new Date()) {
        ctx.addIssue({
          code: "custom",
          path: ["dataInicio"],
          message: "A data de início deve ser presente ou futura.",
        });
      }

      if (data.dataInicio && data.dataTermino && data.dataTermino < data.dataInicio) {
        ctx.addIssue({
          code: "custom",
          path: ["dataTermino"],
          message: "A data de término deve ser após o início.",
        });
      }
    });