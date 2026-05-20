import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/auth/useAuth";
import LoginFormulario from "../components/auth/LoginFormulario";
import "../styles/Login.css";

export default function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="sge-login-bg d-flex align-items-center justify-content-center min-vh-100">
      <LoginFormulario />
    </div>
  );
}
