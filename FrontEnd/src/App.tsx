import { RouterProvider } from "react-router-dom";
import { router } from "./router/AppRouter";
import { AuthProvider } from "./context/auth.context";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </>
  );
}

export default App;
