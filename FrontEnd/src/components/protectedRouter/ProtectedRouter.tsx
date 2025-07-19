import { useEffect, type ReactNode } from "react";
import {useLocation, useNavigate } from "react-router";
import { Navigate} from 'react-router-dom'
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
    const navigate=useNavigate()
    
    useEffect(() => {
      if (user?.role === "mentor" && !user.isApproved) {
        navigate("/mentor/data");
      }
    }, [user, navigate]);
    

    if(loading){
        return <Spinner fullScreen variant="theme"/>
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

