import { Routes, Route, Navigate } from 'react-router-dom';
import  SignupComponent  from '../../components/auth-components/SignUp';
import { LoginComponent } from '../../components/auth-components/Login';
import type { ISignUp, UserRole } from '../../types/auth.types';
import { AuthService } from '../../service/client/auth.service';
import SuccessModal from '../../components/templates/SuccessModal';
import { useState } from 'react';
import { toastService } from '../../components/toast/ToastSystem';  
import { useNavigate } from 'react-router-dom';
import { HttpError } from '../../utility/error.util';
import { Spinner } from '../../components/templates/Spinner';
import { useAuth } from '../../context/auth.context';

const AuthPage: React.FC = () => {
 const [showModal,setShowModal]=useState(false)
 const [modalEmail, setModalEmail] = useState('');
 const [isLoading,setLoading]=useState(false)  
 const {user,setUser}=useAuth()
 const navigate=useNavigate() 
  
  const closeModal=()=>{

    setShowModal(false)
  }

  const handleAuthSubmit =async (data: ISignUp, role: UserRole, source: 'signup' | 'login') => {

    try {
        if(source=='signup'){
              const result=await AuthService.signUp(data)

            if (result) {
                setShowModal(true);
                setModalEmail(result.email)
                
            }

        }else{
            
            const result=await AuthService.login(data)
            
             if(result){
              const payloadData={
                id:result.id,
                email:result.email,
                role:result.role as UserRole
              }
              console.log('user',user)
              setUser(payloadData)
              setLoading(true)
              setTimeout(()=>{
                navigate('/')
              },3000)
             }
        
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

  const handleGoogleAuth = (role: UserRole) => {
    console.log('Google auth for role:', role);
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
      <Routes>
        <Route index element={<Navigate to="login" />} />
        <Route
          path="signup"
          element={
            <SignupComponent
              onSubmit={(data, role) => handleAuthSubmit(data, role, 'signup')}
              onGoogleAuth={handleGoogleAuth}
            />
          }
        />
        <Route
          path="login"
          element={
            <LoginComponent
              onSubmit={(data, role) => handleAuthSubmit(data, role, 'login')}
              onGoogleAuth={handleGoogleAuth}
            />
          }
        />
      </Routes>
        {isLoading&&<Spinner fullScreen size='large' variant='theme'/>}
    </div>
  );
};

export default AuthPage;
