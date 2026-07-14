import { z } from "zod";

export const salaSchema = z.object({
  nome: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  bloco: z.string().min(1, "Informe o bloco."),
  localizacao: z.string().min(2, "A localização deve ter pelo menos 2 caracteres."),
  capacidade: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return null;
      const n = Number(val);
      return isNaN(n) ? null : n;
    },
    z.union([
      z.number().min(1, "A capacidade deve ser pelo menos 1."),
      z.null(),
    ]).refine((val) => val !== null, { message: "Informe a capacidade." })
  ),
});