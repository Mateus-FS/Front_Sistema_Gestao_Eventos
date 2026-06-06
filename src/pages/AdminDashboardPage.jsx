import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EventosTabela from "../components/admin/eventos/EventosTabela";
import InscricoesTabela from "../components/admin/inscricoes/InscricoesTabela";
import NotificacoesTabela from "../components/admin/notificacoes/NotificacoesTabela";
import Perfis from "../components/admin/perfis/Perfis";
import SalasTabela from "../components/admin/salas/SalasTabela";
import UsuariosTabela from "../components/admin/usuarios/UsuariosTabela";
import Navbar from "../components/layout/Navbar";
import { useDashboardAdmin } from "../hooks/admin/useDashboardAdmin";
import { useAuth } from "../hooks/auth/useAuth";
import "../styles/Dashboard.css";

const ABAS = [
  { id: "eventos", icone: "bi-calendar-event", label: "Eventos" },
  { id: "usuarios", icone: "bi-people", label: "Usuários" },
  { id: "inscricoes", icone: "bi-bookmark-check", label: "Inscrições" },
  { id: "salas", icone: "bi-door-open", label: "Salas" },
  { id: "notificacoes", icone: "bi-bell", label: "Notificações" },
  { id: "perfis", icone: "bi-shield-check", label: "Perfis" },
];

export default function AdminDashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState("eventos");

  const { eventos, usuarios, inscricoes, salas, notificacoes, perfis } =
    useDashboardAdmin();

  return (
    <div className="sge-dash-bg min-vh-100">
      <Navbar
        onSair={() => {
          logout();
          navigate("/login");
        }}
      />

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
            </button>
          ))}
        </div>

        <div
          className="card border-0 shadow-sm"
          style={{ borderRadius: "0.75rem" }}
        >
          <div className="card-body p-4">
            <div hidden={abaAtiva !== "eventos"}>
              <EventosTabela dados={eventos} />
            </div>
            {abaAtiva === "usuarios" && <UsuariosTabela dados={usuarios} />}
            {abaAtiva === "inscricoes" && (
              <InscricoesTabela
                dados={inscricoes}
                eventos={eventos.lista}
                usuarios={usuarios.lista}
              />
            )}
            {abaAtiva === "salas" && <SalasTabela dados={salas} />}
            {abaAtiva === "notificacoes" && (
              <NotificacoesTabela dados={notificacoes} />
            )}
            {abaAtiva === "perfis" && <Perfis dados={perfis} />}
          </div>
        </div>
      </div>
    </div>
  );
}
