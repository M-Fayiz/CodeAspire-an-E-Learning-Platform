import { RouterProvider } from "react-router-dom";
import { router } from "./router/AppRouter";
import { ToastProvider } from "./components/toast/ToastProvider";
import { AuthProvider } from "./context/auth.context";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <ToastProvider>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </ToastProvider>
    </>
  );
}

export default App;
