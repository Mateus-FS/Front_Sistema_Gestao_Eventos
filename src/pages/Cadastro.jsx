import CadastroFormulario from "../components/auth/CadastroFormulario";
import "../styles/Cadastro.css";

export default function Cadastro() {
  return (
    <div className="sge-login-bg d-flex align-items-center justify-content-center min-vh-100">
      <div className="sge-bg-shape sge-bg-shape-1" />
      <div className="sge-bg-shape sge-bg-shape-2" />
      <div className="sge-bg-shape sge-bg-shape-3" />
      <CadastroFormulario />
    </div>
  );
}
