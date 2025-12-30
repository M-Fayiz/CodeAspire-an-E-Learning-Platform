// components/shared/AppErrorHandler.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppErrorStore } from "@/store/auth.store";
import { toast } from "sonner";


export default function AppErrorHandler() {
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

  return null;
}
