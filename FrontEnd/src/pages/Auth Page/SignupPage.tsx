import SignupComponent from "../../components/auth-components/SignUp";
import type { ISignUp, UserRole } from "../../types/auth.types";
import { AuthService } from "../../service/auth.service";
import SuccessModal from "../../components/templates/SuccessModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HttpError } from "../../utility/error.util";
import { toast } from "sonner";
// import { Spinner } from '../../components/templates/Spinner';

const SignupPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalEmail, setModalEmail] = useState("");
  //  const [isLoading,setLoading]=useState(false)

  const navigate = useNavigate();

  const closeModal = () => {
    setShowModal(false);
  };

  const handleAuthSubmit = async (data: ISignUp) => {
    try {
      const result = await AuthService.signUp(data);

      if (result) {
        setShowModal(true);
        setModalEmail(result.email);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        if (error.message === "User already exist") {
          navigate("/auth/login");
        }
      } else if (error instanceof HttpError) {
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
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="auth-wrapper">
      {showModal && (
        <SuccessModal
          show={showModal}
          title="Welcome to Tech CodeAspire!"
          message="We have sent a verification mail to your email."
          email={modalEmail || ""}
          onClose={closeModal}
          showCloseButton={true}
          autoClose={true}
          autoCloseDelay={5000}
        />
      )}

      <SignupComponent
        onSubmit={(data) => handleAuthSubmit(data)}
        onGoogleAuth={handleGoogleAuth}
      />

      {/* {isLoading&&<Spinner fullScreen size='large' variant='theme'/>} */}
    </div>
  );
};

export default SignupPage;
