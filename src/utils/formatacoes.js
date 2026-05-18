export const formatarData = (data) => {
  if (!data) return "—";

  return new Date(data).toLocaleDateString("pt-BR", {
    dateStyle: "short",
  });
};

export const normalizar = (data) => {
  return Array.isArray(data) ? data : (data.content ?? []);
};
