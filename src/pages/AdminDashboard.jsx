import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Navbar } from "../components/Navbar";

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSair = () => { logout(); navigate("/login"); };

  return (
    <div className="min-vh-100">
      <Navbar onSair={handleSair} />
      <div className="container py-4">
        <h1>Admin Dashboard</h1>
      </div>
    </div>
  );
}