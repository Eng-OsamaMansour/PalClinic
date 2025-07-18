import React, { createContext, useEffect, useState } from "react";
import { getAccessToken, clearTokens } from "../config/TokenManager";

export const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [access, setAccess]   = useState(null);

  useEffect(() => {
    (async () => {
      setAccess(await getAccessToken());
      setLoading(false);
    })();
  }, []);

  const loginCtx  = (token) => setAccess(token);   
  const logoutCtx = async () => { await clearTokens(); setAccess(null); };

  if (loading) return null;         

  return (
    <AuthCtx.Provider value={{ access, loginCtx, logoutCtx }}>
      {children}
    </AuthCtx.Provider>
  );
}
