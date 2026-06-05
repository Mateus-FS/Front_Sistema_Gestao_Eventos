import { useCallback, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";
import { decodificarUsuario } from "../utils/autenticacao";
import { authStorage } from "../utils/authStorage";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(() => authStorage.get());
  const [nome, setNome] = useState(() => authStorage.getNome());

  const user = useMemo(() => {
    const decoded = decodificarUsuario(token);
    if (!decoded) return null;
    return { ...decoded, nome };
  }, [token, nome]);

  useEffect(() => {
    const onExpirado = () => {
      authStorage.remove();
      setTokenState(null);
      window.location.href = "/login";
    };
    window.addEventListener("auth:expirado", onExpirado);
    return () => window.removeEventListener("auth:expirado", onExpirado);
  }, []);

  const login = useCallback(async (email, senha) => {
    const data = await authService.login(email, senha);
    authStorage.set(data.token);
    authStorage.setNome(data.nome);
    setTokenState(data.token);
    setNome(data.nome);
    return data;
  }, []);

  const logout = useCallback(() => {
    authStorage.remove();
    authStorage.removeNome();
    setTokenState(null);
    setNome(null);
  }, []);

  const loginComToken = useCallback((token) => {
    authStorage.set(token);
    setTokenState(token);
  }, []);

  const atualizarNome = useCallback((novoNome) => {
    authStorage.setNome(novoNome);
    setNome(novoNome);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        loginComToken,
        logout,
        atualizarNome, // adicione aqui
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};