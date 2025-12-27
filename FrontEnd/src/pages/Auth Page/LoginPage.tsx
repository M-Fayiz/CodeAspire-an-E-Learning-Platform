// import  SignupComponent  from '../../components/auth-components/SignUp';
import { LoginComponent } from "../../components/auth-components/Login";
import type { ISignUp, UserRoleType } from "../../types/auth.types";
import { AuthService } from "../../service/auth.service";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Spinner } from "../../components/templates/Spinner";
import { useAuth } from "../../context/auth.context";
import { toast } from "sonner";

const LoginPage: React.FC = () => {
  const [isLoading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const { login } = useAuth();
  const handleAuthSubmit = async (data: ISignUp) => {
    try {
      setLoading(true);
      await login(data);
      navigate("/", { replace: true });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  

  const handleGoogleAuth = async (role: UserRoleType) => {
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
