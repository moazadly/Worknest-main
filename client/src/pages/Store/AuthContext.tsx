import { createContext, ReactNode, useContext, useState } from "react";

interface AuthState {
  token: string;
  setToken: (token: string) => void;
  logout: () => void;
}

export let AuthContext = createContext<AuthState | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AuthContextProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthProviderProps> = ({
  children,
}) => {
  let t: any = localStorage.getItem("Token");
  const [token, setToken] = useState<string>(t ? t : "");

  const logout = () => {
    localStorage.removeItem("Token");
    setToken("");
  };
  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
