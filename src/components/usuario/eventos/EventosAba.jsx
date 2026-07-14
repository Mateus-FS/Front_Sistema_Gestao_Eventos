import { useMemo } from "react";
import SpinnerCentral from "../../shared/SpinnerCentral";
import EventoCard from "./EventoCard";

export default function EventosAba({ dados, inscricoes, onInscrever, onDesinscrever, onAtualizar }) {
  const { lista, carregando } = dados;
  const { lista: minhasInscricoes = [], salvando } = inscricoes;

  const inscricaoPorEvento = useMemo(() => {
    const mapa = new Map();
    minhasInscricoes.forEach((inscricao) => {
      if (inscricao.status !== "CANCELADA") {
        mapa.set(inscricao.eventoId, inscricao);
      }
    });
    return mapa;
  }, [minhasInscricoes]);

  if (carregando) return <SpinnerCentral />;

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="fw-bold text-body-emphasis mb-0">
          <i className="bi bi-calendar-event me-2 text-primary" />
          Eventos disponíveis
        </h5>
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={onAtualizar}
        >
          <i className="bi bi-arrow-clockwise me-1" /> Atualizar
        </button>
      </div>

      {lista.length === 0 ? (
        <div className="text-center py-5 opacity-75">
          <i
            className="bi bi-calendar-x text-body-secondary"
            style={{ fontSize: "2.5rem" }}
          />
          <p className="text-body-secondary mt-3 mb-0">
            Nenhum evento disponível no momento.
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {lista.map((evento) => (
            <EventoCard
              key={evento.id}
              evento={evento}
              inscricao={inscricaoPorEvento.get(evento.id)}
              onInscrever={onInscrever}
              onDesinscrever={onDesinscrever}
              salvando={salvando}
            />
          ))}
        </div>
      )}
    </>
  );
}