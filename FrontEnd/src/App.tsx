import { RouterProvider } from "react-router-dom";
import { router } from "./router/AppRouter";
import { AuthProvider } from "./context/auth.context";
import { Toaster } from "sonner";
import { NotificationProvider } from "./context/notification.context";
import { SocketProvider } from "./context/socket.context";

function App() {
  return (
    <>
      <AuthProvider>
        <SocketProvider>
          <NotificationProvider>
            <RouterProvider router={router} />
            <Toaster />
          </NotificationProvider>
        </SocketProvider>
      </AuthProvider>
    </>
  );
}

export default App;
