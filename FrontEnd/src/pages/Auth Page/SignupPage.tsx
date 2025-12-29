import SignupComponent from "../../components/auth-components/SignUp";
import type { ISignUp, UserRoleType } from "../../types/auth.types";
import { AuthService } from "../../service/auth.service";
import SuccessModal from "../../components/templates/SuccessModal";
import { useState } from "react";

import { toast } from "sonner";
import { useAuth } from "@/context/auth.context";
import { ApiError } from "@/utility/apiError.util";

const SignupPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalEmail, setModalEmail] = useState("");
  const { signup } = useAuth();

  const closeModal = () => {
    setShowModal(false);
  };

  const handleAuthSubmit = async (data: ISignUp) => {
    try {
      const result = await signup(data);
      setShowModal(true);
      setModalEmail(result.email);
    } catch (error) {
      console.log(error)
      if(error  instanceof ApiError){

        toast.error(error.message);
      }
    }
  };

  const handleGoogleAuth = async (role: UserRoleType) => {
    try {
      await AuthService.googleAuth(role);
    } catch (error) {
      if (error instanceof ApiError) {
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
