export const formatarData = (valor) => {
  if (!valor) return "—";
  return new Date(valor).toLocaleDateString("pt-BR", {
    dateStyle: "short",
  });
};

export const formatarSala = (evento) => {
  if (!evento.salaNome) return "—";
  const bloco = evento.salaBloco ? `Bloco ${evento.salaBloco} - ` : "";
  const local = evento.salaLocalizacao ? `${evento.salaLocalizacao} - ` : "";
  return `${bloco}${local}${evento.salaNome}`;
};

export const formatarDestinatario = (notificacao) => {
  if (notificacao.destinatario === "TODOS") return "Todos";
  return notificacao.destinatario?.nome ?? notificacao.destinatario ?? "—";
};

export const paraInputDatetimeLocal = (valor) => {
  if (!valor) return "";
  const str = String(valor);
  return str.includes("T") ? str.slice(0, 16) : `${str}T00:00`;
};