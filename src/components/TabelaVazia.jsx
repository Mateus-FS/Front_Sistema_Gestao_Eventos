export function TabelaVazia({ icone, texto }) {
  return (
    <div className="text-center py-5 opacity-75">
      <i
        className={`bi ${icone} text-body-secondary`}
        style={{ fontSize: "2.5rem" }}
      />
      <p className="text-body-secondary mt-3 mb-0 small">{texto}</p>
    </div>
  );
}