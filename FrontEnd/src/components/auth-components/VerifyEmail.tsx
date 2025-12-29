import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AuthService } from "../../service/auth.service";
import { Spinner } from "../templates/Spinner";
import { useAuth } from "../../context/auth.context";
import NotFound from "../../pages/not-found/Not-Found";
import { toast } from "sonner";
import { ApiError } from "@/utility/apiError.util";

function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const email = params.get("email");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { checkAuth } = useAuth();

  const hasVerifiedRef = useRef(false);

  useEffect(() => {
    async function verify() {
      if (!token || !email || hasVerifiedRef.current) return;

      hasVerifiedRef.current = true;

      try {
        await AuthService.verifyEmail(email, token);

        // toast.success(res.message);
        checkAuth();
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } catch (err) {
        if (err instanceof ApiError) toast.error(err.message);
        // navigate('*')
        setError("Verification failed. Try again .");
      }
    }

    verify();
  }, [token, email, navigate]);

  if (error) return <NotFound error={error} />;
  return <Spinner fullScreen size="large" variant="theme" />;
}

export default VerifyEmail;
