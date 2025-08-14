import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AuthService } from "../../service/client-API/auth.service";
import { Spinner } from "../templates/Spinner";
import { toastService } from "../toast/ToastSystem";
import { useAuth } from "../../context/auth.context";
import NotFound from "../../pages/not-found/Not-Found";

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
      console.log(email, token);
      hasVerifiedRef.current = true;

      try {
        const res = await AuthService.verifyEmail(email, token);
        console.log("response from verify", res);
        toastService.success(res.message);
        checkAuth();
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } catch (err) {
        if (err instanceof Error) toastService.error(err.message);
        // navigate('*')
        setError("Verification failed. Try again .");
      }
    }

    verify();
  }, [token, email, navigate, checkAuth]);

  if (error) return <NotFound error={error} />;
  return <Spinner fullScreen size="large" variant="theme" />;
}

export default VerifyEmail;
