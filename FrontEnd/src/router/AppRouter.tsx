import { createBrowserRouter, Navigate } from "react-router";

import Landing from "../pages/Landing/Landing";

// Auth Components
import LoginPage from "../pages/Auth Page/LoginPage";
import SignupPage from "../pages/Auth Page/SignupPage";
import VerifyEmail from "../components/auth-components/verifyEmail";
import ForgotPassword from "../components/auth-components/ForgotPassword";

import NotFound from "../pages/not-found/Not-Found";
import ErrorFallback from "../components/common/ErrorFallback";
import DynamicLayout from "../pages/Dashboard/Dynamic-Dashboard";
import DashboardContent from "../components/layout/dynamic-layout/Dashboard-Content";
import { Protected_Router } from "../components/protectedRouter/ProtectedRouter";

export const  router=createBrowserRouter([
    {
        path:'/',
        element:<Landing/>,
        errorElement:<ErrorFallback/>
    },
    {
        path: '/auth',
        errorElement: <ErrorFallback />,
        children: [
            { index:true, element: <Navigate to='login'/>},
            { path: 'login' , element: <LoginPage/>},
            { path: 'signup' , element: <SignupPage/>},
            { path: 'forgot-password', element: <ForgotPassword /> },
            { path: 'verify-email', element: <VerifyEmail /> }
        ]
    },
    {
        path:'/learner',
        element:(
            <Protected_Router requiredRole={['learner']}>
                <DynamicLayout/>
            </Protected_Router>
        ),
        children:[
            { index:true, element: <Navigate to='dashboard'/>},
            { path:'dashboard' ,element:<DashboardContent/>}
        ]

     
    },
    {
        path: '*',
        element: <NotFound /> 
    }

])