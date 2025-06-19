import {createContext,useContext,useEffect,useState, type ReactNode} from "react";
// import { useNavigate } from "react-router";
import type { IDecodedUserType } from "../types/auth.types";
import { AuthService } from "../service/client/auth.service";


interface User extends IDecodedUserType{}

interface AuthContextProps{
    user:User|null,
    loading:Boolean,
    checkAuth: () => Promise<void>;
    setUser: (user: User | null) => void;
    logout:()=>Promise<void>

}
// Context
const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: false,
  checkAuth: async () => {},
  setUser: () => {},
  logout: async () => {},
});

interface AuthContext{
    children:ReactNode
}

export const AuthProvider=({children}:AuthContext)=>{
    const [user,setUser]=useState<User|null>(null)
    const [loading,setLoading]=useState<Boolean>(false)
    //  const navigate=useNavigate()

     useEffect(()=>{
      
          checkAuth();
     
     },[])


     const checkAuth=async()=>{
        setLoading(true)
         try {
             const result= await AuthService.authME()
             if(result){
                setLoading(false)
                setUser(result)
             }
             console.log('data delivered to auth context',result)

        } catch (error) {
            setUser(null)
        }finally{
            setLoading(false)
        }

     }

   console.log('user fron context',user)
            const logout = async (): Promise<void> => {
            setLoading(true);
        try {
            const res = await AuthService.logOut();
            if (res) {
            setUser(null);
            
            }
        } catch (error) {
            console.error("Logout error:", error);
            setUser(null);
           
        } finally {
            setLoading(false);
        }
        };


     return(
        <AuthContext.Provider value={{user,setUser,loading,checkAuth,logout}}>
        {children}
        </AuthContext.Provider>
     )
}

export const useAuth=()=>{
    const context=useContext(AuthContext)
    if(!context){
        throw new Error('something went wrong')
    }
    return context
}