export function AlertaFeedback({ sucesso, erro, onFecharSucesso, onFecharErro }) {
  return (
    <>
      {sucesso && (
        <div className="alert alert-success alert-dismissible fade show py-2 small mb-3" role="alert">
          <i className="bi bi-check-circle-fill me-2" />
          {sucesso}
          <button type="button" className="btn-close" aria-label="Fechar" onClick={onFecharSucesso} />
        </div>
      )}
      {erro && (
        <div className="alert alert-danger alert-dismissible fade show py-2 small mb-3" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2" />
          {erro}
          <button type="button" className="btn-close" aria-label="Fechar" onClick={onFecharErro} />
        </div>
      )}
    </>
  );
}