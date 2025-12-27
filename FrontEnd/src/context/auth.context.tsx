import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {  AuthStatus, type AuthStatusType, type IDecodedUserType, type ISignUp } from "../types/auth.types";
import { AuthService } from "../service/auth.service";


interface User extends IDecodedUserType {}

interface AuthContextProps {
  user: User | null;
  status: AuthStatusType;
  login: (data: ISignUp) => Promise<void>;
  signup: (data: ISignUp) => Promise<{ status: number; message: string; email: string }>;
  logout: () => Promise<void>;
}


const AuthContext = createContext<AuthContextProps>({
  user: null,
  login:async()=>{},
  logout: async () => {},
  signup:async()=>{
    throw new Error('Signup not completed')
  },
  status:AuthStatus.CHECKING
});

interface AuthContext {
  children: ReactNode;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatusType>(AuthStatus.CHECKING);


  const bootstrapAuth = async () => {
    try {
       await AuthService.refreshToken(); 
      const user = await AuthService.authME();
      setUser(user);
      setStatus(AuthStatus.AUTHENTICATED);
    } catch (error: any) {
      if (error?.status === 401) {
        setUser(null);
        setStatus(AuthStatus.GUEST);
      } else if (error?.status === 403) {
        setUser(null);
        setStatus(AuthStatus.BLOCKED);
      } else {
        setUser(null);
        setStatus(AuthStatus.GUEST);
      }
    }
  };

  useEffect(() => {
    bootstrapAuth(); 
  }, []);

  const login = async (data: ISignUp) => {
    await AuthService.login(data);
    await bootstrapAuth(); 
  };

  const signup = async (data: ISignUp) => {
  const result = await AuthService.signUp(data);
  await bootstrapAuth();
  return result;
};


  const logout = async () => {
    await AuthService.logOut();
    setUser(null);
    setStatus("guest");
  };

  return (
    <AuthContext.Provider value={{ user, status, login, signup, logout }}>
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
