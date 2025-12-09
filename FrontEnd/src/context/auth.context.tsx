import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { IDecodedUserType } from "../types/auth.types";
import { AuthService } from "../service/auth.service";
import { toast } from "sonner";

interface User extends IDecodedUserType {}

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: false,
  checkAuth: async () => {},
  setUser: () => {},
  logout: async () => {},
});

interface AuthContext {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthContext) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuth();

    const handleLogout = () => {
      logout();
    };

    window.addEventListener("force-logout", handleLogout);
    return () => {
      window.removeEventListener("force-logout", handleLogout);
    };
  }, []);

  const checkAuth = async () => {
    setLoading(true);

    try {
      const result = await AuthService.authME();
      if (result) {
        setUser(result);
        setLoading(false);
      }
     
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await AuthService.logOut();
      if (res) {
        setUser(null);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Logout error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  return (
    <AuthContext.Provider value={{ user, setUser, loading, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("something went wrong");
  }
  return context;
};
