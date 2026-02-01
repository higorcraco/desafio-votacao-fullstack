import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { authService } from "../services/authService";
import type { User } from "../types";

interface AuthContextData {
  user: User | null;
  login: (cpf: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("@votacao:user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Erro ao parsear usuário do localStorage:", error);
        localStorage.removeItem("@votacao:user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (cpf: string) => {
    const userData = await authService.login(cpf);
    setUser(userData);
    localStorage.setItem("@votacao:user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("@votacao:user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
