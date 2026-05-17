import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { eventos, inscricoes, notificacoes } from '../services/apiService';
import './Login.css';

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate   = useNavigate();

  const [abaAtiva, setAbaAtiva]                   = useState('eventos');
  const [listaEventos, setListaEventos]           = useState([]);
  const [minhasInscricoes, setMinhasInscricoes]   = useState([]);
  const [listaNotificacoes, setListaNotificacoes] = useState([]);
  const [loading, setLoading]                     = useState(false);
  const [erro, setErro]                           = useState('');
  const [sucesso, setSucesso]                     = useState('');

  useEffect(() => {
    carregarAba(abaAtiva);
  }, [abaAtiva]);

  const carregarAba = async (aba) => {
    setLoading(true);
    setErro('');
    try {
      if (aba === 'eventos') {
        const data = await eventos.listar();
        setListaEventos(Array.isArray(data) ? data : (data.content ?? []));
      } else if (aba === 'inscricoes') {
        const data = await inscricoes.listar();
        setMinhasInscricoes(Array.isArray(data) ? data : (data.content ?? []));
      } else if (aba === 'notificacoes') {
        const data = await notificacoes.listar();
        setListaNotificacoes(Array.isArray(data) ? data : (data.content ?? []));
      }
    } catch (err) {
      setErro(err.message || 'Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleInscrever = async (eventoId) => {
    setErro('');
    setSucesso('');
    try {
      const token   = localStorage.getItem('sge_token');
      const payload = JSON.parse(atob(token.split('.')[1]));
      const usuarioId = payload.id ?? payload.sub;

      await inscricoes.salvar({ usuarioId, eventoId });
      setSucesso('Inscrição realizada com sucesso!');
      setTimeout(() => setSucesso(''), 3000);
    } catch (err) {
      setErro(err.message || 'Erro ao realizar inscrição.');
    }
  };

  const handleSair = () => {
    logout();
    navigate('/login');
  };

  const abas = [
    { id: 'eventos',      icone: 'bi-calendar-event', label: 'Eventos'           },
    { id: 'inscricoes',   icone: 'bi-bookmark-check', label: 'Minhas Inscrições' },
    { id: 'notificacoes', icone: 'bi-bell',            label: 'Notificações'      },
  ];

  return (
    <div className="sge-dash-bg min-vh-100">

      {/* ── Navbar ─────────────────────────────────── */}
      <nav className="navbar navbar-light bg-white border-bottom shadow-sm px-4 py-3">
        <div className="d-flex align-items-center gap-2">
          <div className="sge-logo-circle-sm">
            <i className="bi bi-calendar-event" />
          </div>
          <span className="navbar-brand fw-bold text-primary mb-0">SGE</span>
          <span className="text-body-secondary small d-none d-md-inline">
            · Sistema de Gestão de Eventos
          </span>
        </div>
        <button
          className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
          onClick={handleSair}
        >
          <i className="bi bi-box-arrow-right" />
          <span className="d-none d-sm-inline">Sair</span>
        </button>
      </nav>

      {/* ── Conteúdo ───────────────────────────────── */}
      <div className="container py-4">

        {/* Alertas globais */}
        {sucesso && (
          <div className="alert alert-success alert-dismissible fade show py-2 small mb-3" role="alert">
            <i className="bi bi-check-circle-fill me-2" />{sucesso}
            <button type="button" className="btn-close" onClick={() => setSucesso('')} />
          </div>
        )}
        {erro && (
          <div className="alert alert-danger alert-dismissible fade show py-2 small mb-3" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2" />{erro}
            <button type="button" className="btn-close" onClick={() => setErro('')} />
          </div>
        )}

        {/* ── Abas ─────────────────────────────────── */}
        <div className="d-flex gap-2 mb-4 flex-wrap">
          {abas.map((aba) => (
            <button
              key={aba.id}
              className={`btn sge-tab-btn ${abaAtiva === aba.id ? 'sge-tab-ativo' : ''}`}
              onClick={() => setAbaAtiva(aba.id)}
            >
              <i className={`bi ${aba.icone} me-2`} />
              {aba.label}
              {aba.id === 'notificacoes' && listaNotificacoes.length > 0 && (
                <span className="badge bg-danger ms-2 rounded-pill" style={{ fontSize: '0.65rem' }}>
                  {listaNotificacoes.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Loading ──────────────────────────────── */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
            <p className="text-body-secondary small mt-3 mb-0">Carregando...</p>
          </div>
        )}

        {/* ── ABA: Eventos ─────────────────────────── */}
        {!loading && abaAtiva === 'eventos' && (
          <>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold text-body-emphasis mb-0">
                <i className="bi bi-calendar-event me-2 text-primary" />
                Eventos disponíveis
              </h5>
              <button className="btn btn-sm btn-outline-primary" onClick={() => carregarAba('eventos')}>
                <i className="bi bi-arrow-clockwise me-1" /> Atualizar
              </button>
            </div>

            {listaEventos.length === 0 ? (
              <div className="text-center py-5 opacity-75">
                <i className="bi bi-calendar-x text-body-secondary" style={{ fontSize: '2.5rem' }} />
                <p className="text-body-secondary mt-3 mb-0">Nenhum evento disponível no momento.</p>
              </div>
            ) : (
              <div className="row g-3">
                {listaEventos.map((evento) => (
                  <div key={evento.id} className="col-12 col-md-6 col-lg-4">
                    <div className="card sge-card h-100 border-0 shadow-sm">
                      <div className="card-body d-flex flex-column">
                        <div className="d-flex align-items-start justify-content-between mb-2">
                          <span className="sge-badge-tipo text-uppercase">
                            {evento.tipoEvento ?? 'Evento'}
                          </span>
                          <span className="text-body-secondary small">
                            <i className="bi bi-people me-1" />{evento.totalInscricoes ?? 0}
                          </span>
                        </div>
                        <h6 className="fw-bold text-body-emphasis mb-1">{evento.titulo}</h6>
                        <p className="text-body-secondary small mb-2 flex-grow-1">{evento.descricao}</p>
                        <div className="d-flex flex-column gap-1 small text-body-secondary mb-3">
                          <div>
                            <i className="bi bi-calendar2 me-1" />
                            {evento.dataInicio} → {evento.dataTermino}
                          </div>
                          {evento.salaNome && (
                            <div><i className="bi bi-geo-alt me-1" />{evento.salaNome}</div>
                          )}
                          {evento.organizadorNome && (
                            <div><i className="bi bi-person me-1" />{evento.organizadorNome}</div>
                          )}
                        </div>
                        <button
                          className="btn btn-primary sge-btn-inscricao w-100 mt-auto"
                          onClick={() => handleInscrever(evento.id)}
                        >
                          <i className="bi bi-plus-circle me-2" />Inscrever-se
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── ABA: Minhas Inscrições ────────────────── */}
        {!loading && abaAtiva === 'inscricoes' && (
          <>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold text-body-emphasis mb-0">
                <i className="bi bi-bookmark-check me-2 text-primary" />
                Minhas inscrições
              </h5>
              <button className="btn btn-sm btn-outline-primary" onClick={() => carregarAba('inscricoes')}>
                <i className="bi bi-arrow-clockwise me-1" /> Atualizar
              </button>
            </div>

            {minhasInscricoes.length === 0 ? (
              <div className="text-center py-5 opacity-75">
                <i className="bi bi-bookmark-x text-body-secondary" style={{ fontSize: '2.5rem' }} />
                <p className="text-body-secondary mt-3 mb-1">Você ainda não tem inscrições.</p>
                <button className="btn btn-sm btn-primary mt-2" onClick={() => setAbaAtiva('eventos')}>
                  Ver eventos disponíveis
                </button>
              </div>
            ) : (
              <div className="row g-3">
                {minhasInscricoes.map((inscricao) => (
                  <div key={inscricao.id} className="col-12 col-md-6">
                    <div className="card sge-card border-0 shadow-sm">
                      <div className="card-body">
                        <div className="d-flex align-items-start justify-content-between">
                          <div>
                            <h6 className="fw-bold text-body-emphasis mb-1">
                              {inscricao.eventoTitulo ?? `Evento #${inscricao.eventoId}`}
                            </h6>
                            <p className="text-body-secondary small mb-2">
                              <i className="bi bi-calendar2 me-1" />
                              Inscrito em: {inscricao.dataInscricao}
                            </p>
                          </div>
                          <span className={`sge-badge-status ${
                            inscricao.status === 'CONFIRMADA' ? 'sge-badge-confirmada'
                            : inscricao.status === 'CANCELADA' ? 'sge-badge-cancelada'
                            : 'sge-badge-pendente'
                          }`}>
                            {inscricao.status}
                          </span>
                        </div>
                        <span className={`small ${inscricao.presente ? 'text-success' : 'text-body-secondary'}`}>
                          <i className={`bi ${inscricao.presente ? 'bi-check-circle-fill' : 'bi-circle'} me-1`} />
                          {inscricao.presente ? 'Presença confirmada' : 'Presença pendente'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── ABA: Notificações ────────────────────── */}
        {!loading && abaAtiva === 'notificacoes' && (
          <>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold text-body-emphasis mb-0">
                <i className="bi bi-bell me-2 text-primary" />
                Notificações
              </h5>
              <button className="btn btn-sm btn-outline-primary" onClick={() => carregarAba('notificacoes')}>
                <i className="bi bi-arrow-clockwise me-1" /> Atualizar
              </button>
            </div>

            {listaNotificacoes.length === 0 ? (
              <div className="text-center py-5 opacity-75">
                <i className="bi bi-bell-slash text-body-secondary" style={{ fontSize: '2.5rem' }} />
                <p className="text-body-secondary mt-3 mb-0">Nenhuma notificação por enquanto.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {listaNotificacoes.map((notif) => (
                  <div key={notif.id} className="card sge-card border-0 shadow-sm sge-notif-card">
                    <div className="card-body py-3 d-flex align-items-start gap-3">
                      <div className="sge-notif-icon flex-shrink-0">
                        <i className="bi bi-bell-fill" />
                      </div>
                      <div className="flex-grow-1">
                        <p className="mb-1 fw-semibold small text-body-emphasis">
                          {notif.mensagem ?? notif.titulo}
                        </p>
                        {notif.dataEnvio && (
                          <span className="text-body-secondary" style={{ fontSize: '0.75rem' }}>
                            <i className="bi bi-clock me-1" />{notif.dataEnvio}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}