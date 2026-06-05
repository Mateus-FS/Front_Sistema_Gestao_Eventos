import MeuPerfilForm from "./MeuPerfilForm";
import { useMeuPerfilUsuario } from "../../../hooks/usuario/useMeuPerfilUsuario";

export default function MeuPerfilAba() {
  const { usuario, salvando, salvar } = useMeuPerfilUsuario();

  return (
    <>
      <div className="d-flex align-items-center mb-4">
        <h5 className="fw-bold text-body-emphasis mb-0">
          <i className="bi bi-person-circle me-2 text-primary" />
          Meu Perfil
        </h5>
      </div>

      <div className="row justify-content-start">
        <div className="col-12 col-md-8 col-lg-6">

          <div className="card border-0 shadow-sm mb-2 sge-card">
            <div className="card-body py-3 px-4">
              <p
                className="small fw-semibold text-body-secondary mb-3 text-uppercase"
                style={{ letterSpacing: "0.07em" }}
              >
                <i className="bi bi-person-badge me-1 text-primary" />
                Dados atuais
              </p>
              <div className="d-flex flex-column gap-2" style={{ fontSize: "0.875rem" }}>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-person text-body-secondary" style={{ width: 16 }} />
                  <span className="text-body-secondary">Nome</span>
                  <span className="fw-semibold text-body-emphasis ms-auto">
                    {usuario?.nome ?? <em className="text-body-secondary fw-normal">não informado</em>}
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-envelope text-body-secondary" style={{ width: 16 }} />
                  <span className="text-body-secondary">E-mail</span>
                  <span className="fw-semibold text-body-emphasis ms-auto">
                    {usuario?.email ?? <em className="text-body-secondary fw-normal">não informado</em>}
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-briefcase text-body-secondary" style={{ width: 16 }} />
                  <span className="text-body-secondary">Função</span>
                  <span className="fw-semibold text-body-emphasis ms-auto">
                    {usuario?.funcao ?? <em className="text-body-secondary fw-normal">não informada</em>}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 my-4 px-1">
            <hr className="flex-grow-1 m-0" style={{ borderColor: "var(--bs-border-color)" }} />
            <span
              className="small text-body-secondary fw-semibold text-uppercase px-2"
              style={{ letterSpacing: "0.07em", whiteSpace: "nowrap" }}
            >
              <i className="bi bi-pencil-square me-1" />
              Editar dados
            </span>
            <hr className="flex-grow-1 m-0" style={{ borderColor: "var(--bs-border-color)" }} />
          </div>

          <MeuPerfilForm
            usuario={usuario}
            salvando={salvando}
            onSalvar={salvar}
          />

        </div>
      </div>
    </>
  );
}