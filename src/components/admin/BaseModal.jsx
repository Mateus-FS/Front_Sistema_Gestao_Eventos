export function BaseModal({ titulo, children, onFechar }) {
  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={(e) => e.target === e.currentTarget && onFechar()}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div
          className="modal-content border-0 shadow-lg"
          style={{ borderRadius: "0.75rem" }}
        >
          <div className="modal-header border-0 pb-0">
            <h6 className="modal-title fw-bold text-body-emphasis">{titulo}</h6>
            <button className="btn-close" onClick={onFechar} />
          </div>
          <div className="modal-body pt-3 pb-4 px-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
