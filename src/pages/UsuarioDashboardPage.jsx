import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import EventosAba from "../components/usuario/eventos/EventosAba";
import InscricoesAba from "../components/usuario/inscricoes/InscricoesAba";
import NotificacoesAba from "../components/usuario/notificacoes/NotificacoesAba";
import MeuPerfilAba from "../components/usuario/meuPerfil/MeuPerfilAba";
import { useAuth } from "../hooks/auth/useAuth";
import { useDashboardUsuario } from "../hooks/usuario/useDashboardUsuario";
import "../styles/Dashboard.css";

export default function UsuarioDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState("eventos");

  const {
    eventos,
    inscricoes,
    notificacoes,
    recarregarTudo,
    totalNotificacoes,
  } = useDashboardUsuario(user.id);

  const ABAS = [
    { id: "eventos", icone: "bi-calendar-event", label: "Eventos" },
    { id: "inscricoes", icone: "bi-bookmark-check", label: "Minhas Inscrições" },
    { id: "notificacoes", icone: "bi-bell", label: "Notificações", badge: totalNotificacoes },
    { id: "perfil", icone: "bi-person-circle", label: "Meu Perfil" },
  ];

  return (
    <div className="sge-dash-bg min-vh-100">
      <Navbar user={user} onSair={() => { logout(); navigate("/login"); }} />

      <div className="container py-4">
        <div className="d-flex gap-2 mb-4 flex-wrap">
          {ABAS.map((aba) => (
            <button
              key={aba.id}
              className={`btn sge-tab-btn ${abaAtiva === aba.id ? "sge-tab-ativo" : ""}`}
              onClick={() => setAbaAtiva(aba.id)}
            >
              <i className={`bi ${aba.icone} me-2`} />
              {aba.label}
              {aba.badge > 0 && (
                <span className="badge bg-danger ms-2 rounded-pill" style={{ fontSize: "0.65rem" }}>
                  {aba.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {abaAtiva === "eventos" && (
          <EventosAba
            dados={eventos}
            inscricoes={inscricoes}
            onInscrever={inscricoes.inscrever}
            onDesinscrever={inscricoes.desinscrever}
            onAtualizar={recarregarTudo}
          />
        )}
        {abaAtiva === "inscricoes" && (
          <InscricoesAba
            dados={inscricoes}
            onAtualizar={recarregarTudo}
            onVerEventos={() => setAbaAtiva("eventos")}
          />
        )}
        {abaAtiva === "notificacoes" && (
          <NotificacoesAba dados={notificacoes} onAtualizar={recarregarTudo} />
        )}
        {abaAtiva === "perfil" && (
          <MeuPerfilAba />
        )}
      </div>
    </div>
  );
}