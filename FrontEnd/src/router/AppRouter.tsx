import { createBrowserRouter, Navigate } from "react-router";

import Landing from "../pages/Landing/Landing";

// Auth Components
import LoginPage from "../pages/Auth Page/LoginPage";
import SignupPage from "../pages/Auth Page/SignupPage";
import VerifyEmail from "../components/auth-components/verifyEmail";
import ForgotPassword from "../components/auth-components/ForgotPassword";
import ResetPassword from "../components/auth-components/ResetPassword";

import NotFound from "../pages/not-found/Not-Found";
import ErrorFallback from "../components/common/ErrorFallback";
import DynamicLayout from "../pages/Daynamic-Layout/Dynamic-Dashboard";
import DashboardContent from "../components/layout/dynamic-layout/Dashboard-Content";
import { Protected_Router } from "../components/protectedRouter/ProtectedRouter";
import ProfileManagement from "../pages/Profile Page/Profile";
import UserManagement from "../pages/Admin Page/user-management/UserMangement";
// import MentorInfoForm from "../components/Mentor/Mentor";
import AdminUserProfile from "../pages/Admin Page/user-management/UserProfile";
import { useProfileLoader } from "../pages/Admin Page/user-management/profile.loader";
import MentorDataForm from "../components/auth-components/MentorInformation";

import CategoryManagement from "@/pages/Admin Page/category";
import CourseCreation from "@/pages/Mentor_Page/course_creation/Index";
import { CourseFormProvider } from "@/context/courseForm.context";

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
            { path: 'verify-email', element: <VerifyEmail /> },
            { path: 'reset-password', element: <ResetPassword /> },
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
            { path:'dashboard' ,element:<DashboardContent/>},
            { path:'profile' ,element:<ProfileManagement/>}
        ]

     
    },
    {
        path:'/mentor',
        element:(
            <Protected_Router requiredRole={['mentor']}>
                <DynamicLayout/>
            </Protected_Router>
        ),
        children:[
            { index:true, element: <Navigate to='dashboard'/>},
            { path:'dashboard' ,element:<DashboardContent/>},
            { path:'profile' ,element:<ProfileManagement/>},
            { path: 'data', element: <MentorDataForm /> },
            { path: 'create', element:(
                <CourseFormProvider>
                    <CourseCreation />
                </CourseFormProvider>
            ) },
        ]
    },
    {
        path:'/admin',
        element:(
            <Protected_Router requiredRole={['admin']}>
                <DynamicLayout/>
            </Protected_Router>
        ),
        children:[
            { index:true, element: <Navigate to='dashboard'/>},
            { path:'dashboard' ,element:<DashboardContent/>},
            { path:'profile' ,element:<ProfileManagement/>},
            { path:'users' ,element:<UserManagement/>},
            { path:'user-profile/:id' ,element:<AdminUserProfile/>,loader:useProfileLoader},
            { path: 'category',element: <CategoryManagement /> },
        ]
    },
    {
        path: '*',
        element: <NotFound /> 
    },

])