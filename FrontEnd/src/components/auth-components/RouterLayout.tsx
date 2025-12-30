import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppErrorStore } from "@/store/auth.store";
import { toast } from "sonner";

export default function RootLayout() {
  const navigate = useNavigate();
  const { redirectTo, message, clear } = useAppErrorStore();

  useEffect(() => {
    if (!redirectTo) return;

    if (message) {
      toast.error(message);
    }

    navigate(redirectTo);
    clear();
  }, [redirectTo, message, navigate, clear]);

  return (
    <>
      <Outlet />
    </>
  );
}
