export const formatarData = (valor) => {
  if (!valor) return "—";

  return new Date(valor).toLocaleDateString("pt-BR", {
    dateStyle: "short",
  });
};

export const extrairLista = (resposta) => {
  if (Array.isArray(resposta)) return resposta;
  return resposta?.content ?? [];
};

export const paraInputDatetimeLocal = (valor) => {
  if (!valor) return "";
  const str = String(valor);
  return str.includes("T") ? str.slice(0, 16) : `${str}T00:00`;
};
