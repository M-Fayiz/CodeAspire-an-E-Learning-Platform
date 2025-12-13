// import  SignupComponent  from '../../components/auth-components/SignUp';
import { LoginComponent } from "../../components/auth-components/Login";
import type { ISignUp, UserRole } from "../../types/auth.types";
import { AuthService } from "../../service/auth.service";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HttpError } from "../../utility/error.util";
import { Spinner } from "../../components/templates/Spinner";
import { useAuth } from "../../context/auth.context";
import { toast } from "sonner";

const LoginPage: React.FC = () => {
  const [isLoading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const { checkAuth } = useAuth();

  const handleAuthSubmit = async (data: ISignUp) => {
    try {
      const result = await AuthService.login(data);

      if (result) {
        const payloadData = {
          id: result.id,
          email: result.email,
          role: result.role as UserRole,
        };
        checkAuth();
        setUser(payloadData);
        setLoading(true);
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 3000);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        if (error.message === "User already exist") {
          navigate("/auth/login");
        }
      } else if (error instanceof HttpError) {
        console.log("error status", error);
        switch (error.status) {
          case 404:
            toast.error(`${error.message}. Please sign up.`);
            navigate("/auth/signup");
            return;
          case 401:
            return toast.error(error.message);
          default:
            return toast.error("Something went wrong");
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
