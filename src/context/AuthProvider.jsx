import { useCallback, useMemo, useState } from "react";
import { auth, getToken, removeToken, setToken } from "../services/apiService";
import { AuthContext } from "./AuthContext";

function decodeUser(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id: payload.id,
      email: payload.sub,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());
  const user = useMemo(() => decodeUser(token), [token]);

  const login = useCallback(async (email, senha) => {
    const data = await auth.login(email, senha);
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
      value={{ user, token, login, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
}
