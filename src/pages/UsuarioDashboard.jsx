import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertaFeedback } from "../components/AlertaFeedback";
import { EventoCard } from "../components/EventoCard";
import { InscricaoCard } from "../components/InscricaoCard";
import { Navbar } from "../components/Navbar";
import { NotificacaoCard } from "../components/NotificacaoCard";
import { SpinnerCentral } from "../components/SpinnerCentral";
import { useAuth } from "../hooks/auth/useAuth";
import { useEventosUsuario } from "../hooks/usuario/useEventosUsuario";
import { useInscricoesUsuario } from "../hooks/usuario/useInscricoesUsuario";
import { useNotificacoesUsuario } from "../hooks/usuario/useNotificacoesUsuario";
import "../styles/Login.css";

const ABAS = [
  { id: "eventos", icone: "bi-calendar-event", label: "Eventos" },
  { id: "inscricoes", icone: "bi-bookmark-check", label: "Minhas Inscrições" },
  { id: "notificacoes", icone: "bi-bell", label: "Notificações" },
];

export default function UsuarioDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState("eventos");

  const {
    listaEventos,
    carregando: carregandoEventos,
    erro: erroEventos,
    setErro: setErroEventos,
    recarregar: recarregarEventos,
  } = useEventosUsuario();

  const {
    minhasInscricoes,
    carregando: carregandoInscricoes,
    erro: erroInscricoes,
    setErro: setErroInscricoes,
    sucesso,
    setSucesso,
    inscrever,
    desinscrever,
    recarregar: recarregarInscricoes,
  } = useInscricoesUsuario(user.id);

  const {
    listaNotificacoes,
    carregando: carregandoNotificacoes,
    erro: erroNotificacoes,
    setErro: setErroNotificacoes,
    recarregar: recarregarNotificacoes,
  } = useNotificacoesUsuario();

  const carregando = carregandoEventos || carregandoInscricoes || carregandoNotificacoes;
  const erro = erroEventos || erroInscricoes || erroNotificacoes;

  const handleFecharErro = () => {
    setErroEventos("");
    setErroInscricoes("");
    setErroNotificacoes("");
  };

  const handleAtualizar = () => {
    recarregarEventos();
    recarregarInscricoes();
    recarregarNotificacoes();
  };

  const handleSair = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="sge-dash-bg min-vh-100">
      <Navbar onSair={handleSair} />

      <div className="container py-4">
        <AlertaFeedback
          sucesso={sucesso}
          erro={erro}
          onFecharSucesso={() => setSucesso("")}
          onFecharErro={handleFecharErro}
        />

        <div className="d-flex gap-2 mb-4 flex-wrap">
          {ABAS.map((aba) => (
            <button
              key={aba.id}
              className={`btn sge-tab-btn ${abaAtiva === aba.id ? "sge-tab-ativo" : ""}`}
              onClick={() => setAbaAtiva(aba.id)}
            >
              <i className={`bi ${aba.icone} me-2`} />
              {aba.label}
              {aba.id === "notificacoes" && listaNotificacoes.length > 0 && (
                <span
                  className="badge bg-danger ms-2 rounded-pill"
                  style={{ fontSize: "0.65rem" }}
                >
                  {listaNotificacoes.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {carregando && <SpinnerCentral />}

        {!carregando && abaAtiva === "eventos" && (
          <>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold text-body-emphasis mb-0">
                <i className="bi bi-calendar-event me-2 text-primary" />
                Eventos disponíveis
              </h5>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={handleAtualizar}
              >
                <i className="bi bi-arrow-clockwise me-1" /> Atualizar
              </button>
            </div>
            {listaEventos.length === 0 ? (
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
                {listaEventos.map((evento) => (
                  <EventoCard
                    key={evento.id}
                    evento={evento}
                    onInscrever={inscrever}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {!carregando && abaAtiva === "inscricoes" && (
          <>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold text-body-emphasis mb-0">
                <i className="bi bi-bookmark-check me-2 text-primary" />
                Minhas inscrições
              </h5>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={handleAtualizar}
              >
                <i className="bi bi-arrow-clockwise me-1" /> Atualizar
              </button>
            </div>
            {minhasInscricoes.length === 0 ? (
              <div className="text-center py-5 opacity-75">
                <i
                  className="bi bi-bookmark-x text-body-secondary"
                  style={{ fontSize: "2.5rem" }}
                />
                <p className="text-body-secondary mt-3 mb-1">
                  Você ainda não tem inscrições.
                </p>
                <button
                  className="btn btn-sm btn-primary mt-2"
                  onClick={() => setAbaAtiva("eventos")}
                >
                  Ver eventos disponíveis
                </button>
              </div>
            ) : (
              <div className="row g-3">
                {minhasInscricoes.map((inscricao) => (
                  <InscricaoCard
                    key={inscricao.id}
                    inscricao={inscricao}
                    onDesinscrever={desinscrever}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {!carregando && abaAtiva === "notificacoes" && (
          <>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold text-body-emphasis mb-0">
                <i className="bi bi-bell me-2 text-primary" />
                Notificações
              </h5>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={handleAtualizar}
              >
                <i className="bi bi-arrow-clockwise me-1" /> Atualizar
              </button>
            </div>
            {listaNotificacoes.length === 0 ? (
              <div className="text-center py-5 opacity-75">
                <i
                  className="bi bi-bell-slash text-body-secondary"
                  style={{ fontSize: "2.5rem" }}
                />
                <p className="text-body-secondary mt-3 mb-0">
                  Nenhuma notificação por enquanto.
                </p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {listaNotificacoes.map((notificacao) => (
                  <NotificacaoCard
                    key={notificacao.id}
                    notificacao={notificacao}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
