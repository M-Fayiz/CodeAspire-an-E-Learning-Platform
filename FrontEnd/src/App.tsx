
import {RouterProvider} from "react-router-dom"
import {router} from './router/AppRouter'
// import VerifyEmail from "./components/auth-components/verifyEmail"
// import Landing from "./pages/Landing/Landing"
// import Auth from "./pages/Sign-Up/Sign-Up"
// import AuthPage from "./pages/Auth Page/Auth-Page"
// import StudentDashboard from "./components/layout/sample"
import { ToastProvider } from "./components/toast/ToastProvider"
import { AuthProvider } from "./context/auth.context"
// import NotFound from "./pages/not-found/Not-Found"
// import DynamicLayout from "./pages/Dashboard/Dynamic-Dashboard"
// import DashboardContent from "./components/layout/dynamic-layout/Dashboard-Content"

function App() {


  return (
    <>
    <ToastProvider>
   <AuthProvider>
      <RouterProvider router={router}/>
   </AuthProvider>
    </ToastProvider>
    </>
  )
}

export default App
