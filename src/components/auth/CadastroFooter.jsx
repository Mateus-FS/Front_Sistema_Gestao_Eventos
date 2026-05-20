import { useNavigate } from "react-router-dom";

export default function CadastroFooter() {
  const navigate = useNavigate();

  return (
    <>
      <p className="text-center text-body-secondary small mt-4 mb-0">
        Já tem uma conta?{" "}
        <button
          className="btn btn-link sge-link fw-semibold text-decoration-none p-0 small"
          onClick={() => navigate("/login")}
        >
          Entrar
        </button>
      </p>
      <p className="text-center text-body-secondary small mt-3 opacity-75">
        © {new Date().getFullYear()} SGE · IFPB
      </p>
    </>
  );
}
