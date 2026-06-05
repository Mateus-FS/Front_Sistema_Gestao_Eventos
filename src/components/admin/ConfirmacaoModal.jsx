export default function ConfirmacaoModal({ aberto, titulo, mensagem, textoBotao = "Confirmar", variante = "danger", onConfirmar, onCancelar, carregando }) {
  if (!aberto) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.45)" }}>
      <div className="modal-dialog modal-dialog-centered modal-sm">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "0.75rem" }}>
          <div className="modal-body p-4 text-center">
            <div
              className={`mx-auto mb-3 d-flex align-items-center justify-content-center bg-${variante} bg-opacity-10 rounded-circle`}
              style={{ width: 52, height: 52 }}
            >
              <i className={`bi ${variante === "danger" ? "bi-trash3" : "bi-x-circle"} text-${variante} fs-4`} />
            </div>
            <h6 className="fw-bold text-body-emphasis mb-1">{titulo}</h6>
            <p className="small text-body-secondary mb-0">{mensagem}</p>
          </div>
          <div className="modal-footer border-0 justify-content-center pb-4 pt-0 gap-2">
            <button className="btn btn-outline-secondary btn-sm px-4" onClick={onCancelar} disabled={carregando}>
              Cancelar
            </button>
            <button className={`btn btn-${variante} btn-sm px-4`} onClick={onConfirmar} disabled={carregando}>
              {carregando && <span className="spinner-border spinner-border-sm me-1" />}
              {textoBotao}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}