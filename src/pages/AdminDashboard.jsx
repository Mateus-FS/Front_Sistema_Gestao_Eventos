import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EventosTabela } from "../components/admin/eventos/EventosTabela";
import { InscricoesTabela } from "../components/admin/inscricoes/InscricoesTabela";
import { NotificacoesTabela } from "../components/admin/notificacoes/NotificacoesTabela";
import { Perfis } from "../components/admin/perfis/Perfis";
import { SalasTabela } from "../components/admin/salas/SalasTabela";
import { UsuariosTabela } from "../components/admin/usuarios/UsuariosTabela";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../hooks/auth/useAuth";
import { useEventosAdmin } from "../hooks/admin/useEventosAdmin";
import { useInscricoesAdmin } from "../hooks/admin/useInscricoesAdmin";
import { useNotificacoesAdmin } from "../hooks/admin/useNotificacoesAdmin";
import { usePerfisAdmin } from "../hooks/admin/usePerfisAdmin";
import { useSalasAdmin } from "../hooks/admin/useSalasAdmin";
import { useUsuariosAdmin } from "../hooks/admin/useUsuariosAdmin";

import "../styles/Login.css";

const ABAS = [
  { id: "eventos", icone: "bi-calendar-event", label: "Eventos" },
  { id: "usuarios", icone: "bi-people", label: "Usuários" },
  { id: "inscricoes", icone: "bi-bookmark-check", label: "Inscrições" },
  { id: "salas", icone: "bi-door-open", label: "Salas" },
  { id: "notificacoes", icone: "bi-bell", label: "Notificações" },
  { id: "perfis", icone: "bi-shield-check", label: "Perfis" },
];

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState("eventos");
  const [abasVisitadas, setAbasVisitadas] = useState(new Set(["eventos"]));

  const hookEventos = useEventosAdmin();
  const hookUsuarios = useUsuariosAdmin();
  const hookInscricoes = useInscricoesAdmin({onAtualizar: hookEventos.recarregar});  const hookSalas = useSalasAdmin();
  const hookNotificacoes = useNotificacoesAdmin();
  const hookPerfis = usePerfisAdmin();

  const handleSair = () => {
    logout();
    navigate("/login");
  };

  const handleAba = (id) => {
    setAbaAtiva(id);
    setAbasVisitadas((prev) => new Set([...prev, id]));
  };

  return (
    <div className="sge-dash-bg min-vh-100">
      <Navbar onSair={handleSair} />
      <div className="container py-4">
        <div className="d-flex gap-2 mb-4 flex-wrap">
          {ABAS.map((aba) => (
            <button
              key={aba.id}
              className={`btn sge-tab-btn ${abaAtiva === aba.id ? "sge-tab-ativo" : ""}`}
              onClick={() => handleAba(aba.id)}
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
            {abaAtiva === "eventos" && <EventosTabela dados={hookEventos} />}
            {abasVisitadas.has("usuarios") && (
              <div hidden={abaAtiva !== "usuarios"}>
                <UsuariosTabela dados={hookUsuarios} />
              </div>
            )}
            {abasVisitadas.has("inscricoes") && (
              <div hidden={abaAtiva !== "inscricoes"}>
                <InscricoesTabela
                  dados={hookInscricoes}
                  eventos={hookEventos.lista}
                  usuarios={hookUsuarios.lista}
                />
              </div>
            )}
            {abasVisitadas.has("salas") && (
              <div hidden={abaAtiva !== "salas"}>
                <SalasTabela dados={hookSalas} />
              </div>
            )}
            {abasVisitadas.has("notificacoes") && (
              <div hidden={abaAtiva !== "notificacoes"}>
                <NotificacoesTabela dados={hookNotificacoes} />
              </div>
            )}
            {abasVisitadas.has("perfis") && (
              <div hidden={abaAtiva !== "perfis"}>
                <Perfis dados={hookPerfis} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
