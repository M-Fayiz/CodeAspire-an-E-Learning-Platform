
import  SignupComponent  from '../../components/auth-components/SignUp';
import type { ISignUp, UserRole } from '../../types/auth.types';
import { AuthService } from '../../service/client/auth.service';
import SuccessModal from '../../components/templates/SuccessModal';
import { useState } from 'react';
import { toastService } from '../../components/toast/ToastSystem';  
import { useNavigate } from 'react-router-dom';
import { HttpError } from '../../utility/error.util';
// import { Spinner } from '../../components/templates/Spinner';


const SignupPage: React.FC = () => {
 const [showModal,setShowModal]=useState(false)
 const [modalEmail, setModalEmail] = useState('');
//  const [isLoading,setLoading]=useState(false)  

 const navigate=useNavigate() 
  
  const closeModal=()=>{

    setShowModal(false)
  }

  const handleAuthSubmit =async (data: ISignUp) => {
   console.log('data from sign up' ,data)
    try {
       
              const result=await AuthService.signUp(data)

            if (result) {
                setShowModal(true);
                setModalEmail(result.email)
                
            }
    } catch (error) {
        if(error instanceof Error){

            toastService.error(error.message)
             if(error.message==='User already exist'){
                navigate('/auth/login')    
              }

        }else if(error instanceof HttpError){

            switch(error.status){
              case 404:
                 toastService.error(`${error.message}. Please sign up.`);
                  navigate('/auth/signup')
                  return
              case 401:
                return toastService.error(error.message) 
              default :
              return toastService.error('Something went wrong') 
            }
        }

    }
  };

  const handleGoogleAuth =async (role: UserRole) => {
     try {
      const result= await AuthService.googleAuth(role)
        
     } catch (error) {
      console.log(error)
     }
  };

  return (
    <div className="auth-wrapper">
        {showModal && (
      <SuccessModal
        show={showModal}
        title="Welcome to Tech Master!"
        message="We have sent a verification mail to your email."
        email={modalEmail || ''} 
        onClose={closeModal}
        showCloseButton={true}
        autoClose={true}
        autoCloseDelay={4000}
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
