import { useEffect, useState } from "react";
import { Code,User,Mail,Phone ,Lock,ArrowRight} from "lucide-react";
import RoleSelection from "./Role";
// import InputField from "../../atoms/AuthInput";
import ThreeDIllustration from "./3d-Illustration";
import SuccessAnimation from "./Success";
import { AuthService } from "../../../service/client/auth.service";
import { registrationSchema } from "../../../utility/validateForm";
import type { ISignUp } from "../../../types/auth.types";
import { toastService } from "../../toast/ToastSystem";
import { useNavigate } from "react-router";

import Temp from "../../atoms/authInputs";


interface AuthProps{
    Authmode:'login'|'register'
}

const RegistrationPage: React.FC<AuthProps> = ({Authmode}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'student' | 'mentor'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState<{ show: boolean; email: string }>({ show: false, email: '' });

  const navigate=useNavigate()
  useEffect(()=>{
       if(mode=='login'){
        navigate('/login',{ replace: true })
       }else{
        navigate('/signup',{ replace: true })
       }
  },[mode])

  const [formData, setFormData] = useState<ISignUp>({
    name: '',
    email: '',
    phone: '',
    password: '',
    role:'learner',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<{[key:string]:string}>({})

   const updateFormData=(e:React.ChangeEvent<HTMLInputElement>)=>{
           const {name,value}=e.target
           setFormData((prv)=>({...prv,[name]:value}))
           console.log(formData)
    }

  //   Handle Submition of form data 
   const submitFormData=async(e:React.FormEvent<HTMLFormElement>)=>{
      e.preventDefault()

      const roleAdded={...formData,role}
      //  Validate Form Data 
      const result=registrationSchema.safeParse(roleAdded)
      if(!result.success){
         const ERROR:{[key:string]:string}={}
        result.error.errors.forEach(err=>{
            if(err.path[0]){
                ERROR[err.path[0]]=err.message
            }
        })
        setErrors(ERROR)
        return
      }

      setErrors({})

   try {
               
      if (Authmode === 'register') {
      
          setIsLoading(true)
          const result=await AuthService.signUp(formData)
         
          if (result) {
          setShowSuccess({ show: true, email: result.email });
          }

          setIsLoading(false)
          setMode('login');

           setFormData({
            name: '',
            email: '',
            phone: '',
            password: '', 
            confirmPassword: ''
          })
      } else {
          setIsLoading(true)  
          const result=await AuthService.login() 
          console.log(result)   
          alert('Login successful!');
      }
                  
  } catch (error) {
       if( error instanceof Error){
        
           toastService.error(error.message)  
           if(error.message==='User already exist'){
            setMode('login')
            setIsLoading(false)
           }
          
        }
   }
   }   

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setErrors({});
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
     
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96  bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96  bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      
      <header className="relative z-10 p-3">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Code className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">TechMaster</span>
        </div>
      </header>

      <div className="relative z-10 min-h-screen flex items-center justify-center ">
        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">
        
          <div className="hidden lg:block h-80 lg:h-[500px]">
            <ThreeDIllustration mode={mode} role={role} />
          </div>

         
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-5 border border-white/20 shadow-2xl">
           
              <div className="flex bg-white/10 rounded-2xl p-1 mb-4">
                <button
                  onClick={() => setMode('login')}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    mode === 'login'
                      ? 'bg-white text-purple-600 shadow-lg'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setMode('register')}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    mode === 'register'
                      ? 'bg-white text-purple-600 shadow-lg'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Register
                </button>
              </div>

             
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {mode === 'login' ? 'Welcome Back!' : 'Join TechMaster'}
                </h2>
                <p className="text-blue-200">
                  {mode === 'login' 
                    ? 'Continue your coding journey' 
                    : 'Start your path to tech mastery'
                  }
                </p>
              </div>

              
              {mode === 'register' && (
                <RoleSelection 
                  selectedRole={role}
                   
                  onRoleChange={setRole}
                />
              )}

              {/* Form Fields */}
              <form onSubmit={submitFormData}>
              <div className="space-y-2">
                {mode === 'register' && (
                  <Temp
                    label="You Name"
                    type="text"
                    placeholder="Full Name"
                    value={formData.name||''}
                    name='name'
                    onChange={updateFormData}
                    icon={<User className="w-5 h-5" />}
                    error={errors.name}
                  />
                )}
                  
                <Temp
                  label="E-mail"
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  name="email"
                  onChange={updateFormData}
                  icon={<Mail className="w-5 h-5" />}
                  error={errors.email}
                />

                {mode === 'register' && (
                  <Temp
                    label="Phone Number"
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone||''}
                    name="phone"
                    onChange={updateFormData}
                    icon={<Phone className="w-5 h-5" />}
                    error={errors.phone}
                  />
                )}
             
                <Temp
                  label="Password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  name="password"
                  onChange={updateFormData}
                  icon={<Lock className="w-5 h-5" />}
                  error={errors.password}
                  showPasswordToggle
                />

                {mode === 'register' && (
                  <Temp
                  label="Confirm Password"
                    type="password"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={formData.confirmPassword||''}
                    onChange={ updateFormData}
                    icon={<Lock className="w-5 h-5" />}
                    error={errors.confirmPassword}
                    showPasswordToggle
                  />
                )}
              </div>

           
              {mode === 'login' && (
                <div className="text-right mt-4">
                  <button className="text-blue-300 hover:text-white text-sm transition-colors">
                    Forgot Password?
                  </button>
                </div>
              )}

             
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
                  </>
                ) : (
                  <>
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </button>
              </form>

             
              <div className="text-center mt-6 text-blue-200">
                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={toggleMode}
                  className="text-white font-semibold hover:underline"
                >
                  {mode === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
              </div>

             
              {mode === 'register' && (
                <div className="text-center mt-4 text-xs text-blue-300">
                  By creating an account, you agree to our{' '}
                  <a href="#" className="underline hover:text-white">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="underline hover:text-white">Privacy Policy</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Animation */}
      <SuccessAnimation show={showSuccess.show} email={showSuccess.email}  />
    </div>
  );
};

export default RegistrationPage