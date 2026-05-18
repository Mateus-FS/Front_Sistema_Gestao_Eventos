import { useCallback, useMemo, useState } from "react";
import { authService, getToken, removeToken, setToken } from "../services/authService";
import { decodificarUsuario } from "../utils/autenticacao";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(() => getToken());

  const user = useMemo(() => decodificarUsuario(token), [token]);

  const login = useCallback(async (email, senha) => {
    const data = await authService.login(email, senha);

    setToken(data.token);
    setTokenState(data.token);

    return data.token;
  }, []);

  const logout = useCallback(() => {
    removeToken();

    setTokenState(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
