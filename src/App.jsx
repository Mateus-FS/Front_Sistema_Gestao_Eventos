import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { PrivateRoute } from "./components/PrivateRoute";
import AdminDashboard from "./pages/AdminDashboard";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import RecuperarSenha from "./pages/RecuperarSenha";
import UsuarioDashboard from "./pages/UsuarioDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<UsuarioDashboard />} />
        </Route>
        <Route element={<PrivateRoute role="ADMIN" />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}