import { createBrowserRouter } from "react-router";

import Landing from "../pages/Landing/Landing";
import AuthPage from "../pages/Auth Page/Auth-Page";
import VerifyEmail from "../components/auth-components/verifyEmail";

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
        path:'/auth/*',
        element:<AuthPage/>,   
        errorElement :<ErrorFallback/>
    },
    {
        path: "/auth/verify-email",
        element: <VerifyEmail />,
    },
    {
        path:'/learner',
        element:(
            <Protected_Router requiredRole={['learner']}>
                <DynamicLayout/>
            </Protected_Router>
        ),
        children:[
            { path:'dashboard' ,element:<DashboardContent/>}
        ]

     
    },

    {
        path: '*',
        element: <NotFound /> 
    }

])