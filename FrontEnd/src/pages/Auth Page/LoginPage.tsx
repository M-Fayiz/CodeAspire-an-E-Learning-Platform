// import  SignupComponent  from '../../components/auth-components/SignUp';
import { LoginComponent } from "../../components/auth-components/Login";
import type { ISignUp, UserRole } from "../../types/auth.types";
import { AuthService } from "../../service/client-API/auth.service";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { toastService } from "../../components/toast/ToastSystem";
import { useNavigate } from "react-router-dom";
import { HttpError } from "../../utility/error.util";
import { Spinner } from "../../components/templates/Spinner";
import { useAuth } from "../../context/auth.context";

const LoginPage: React.FC = () => {
  const [isLoading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleAuthSubmit = async (data: ISignUp) => {
    try {
      const result = await AuthService.login(data);

      if (result) {
        const payloadData = {
          id: result.id,
          email: result.email,
          role: result.role as UserRole,
        };

        setUser(payloadData);
        setLoading(true);
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 3000);
      }
    } catch (error) {
      if (error instanceof Error) {
        toastService.error(error.message);
        if (error.message === "User already exist") {
          navigate("/auth/login");
        }
      } else if (error instanceof HttpError) {
        console.log("error status", error);
        switch (error.status) {
          case 404:
            toastService.error(`${error.message}. Please sign up.`);
            navigate("/auth/signup");
            return;
          case 401:
            return toastService.error(error.message);
          default:
            return toastService.error("Something went wrong");
        }
      }
    }
  };

  const handleGoogleAuth = async (role: UserRole) => {
    try {
      await AuthService.googleAuth(role);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="">
      <LoginComponent
        onSubmit={(data) => handleAuthSubmit(data)}
        onGoogleAuth={handleGoogleAuth}
      />

      {isLoading && <Spinner fullScreen size="large" variant="theme" />}
    </div>
  );
};

export default LoginPage;
