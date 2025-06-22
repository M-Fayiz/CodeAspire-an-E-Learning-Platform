import type { ReactNode } from "react";
import { Navigate,useLocation } from "react-router";
import { useAuth } from "../../context/auth.context";
import type { UserRole } from "../../types/auth.types";
import { Spinner } from "../templates/Spinner";


interface ProtectedProps{
    children:ReactNode,
    fallback?:string
    requiredRole:UserRole[]
}


export const Protected_Router:React.FC<ProtectedProps>=({children,requiredRole,fallback='/auth/login'})=>{
         
    const {loading,user}=useAuth()
     const location=useLocation()
    if(loading){
        return  <Spinner fullScreen variant="theme"/>
    }
    console.log('user from context in protect',user)
    if(!user){
        return <Navigate to={fallback} state={{ from: location }}  replace />
    }

    if(requiredRole.length>0){
        const hasRole=requiredRole.find(role=>user.role==role)
        if(!hasRole){
              return <Navigate to="/unauthorized" replace />;
        }
    }
    return children
}

