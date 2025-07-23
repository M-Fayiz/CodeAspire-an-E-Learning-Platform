
import {RouterProvider} from "react-router-dom"
import {router} from './router/AppRouter'
import { ToastProvider } from "./components/toast/ToastProvider"
import { AuthProvider } from "./context/auth.context"

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
