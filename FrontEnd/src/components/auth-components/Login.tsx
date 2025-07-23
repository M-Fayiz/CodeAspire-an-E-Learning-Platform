import React, { useState } from 'react';
import { LogIn, Mail, Lock, Code} from 'lucide-react'; // Adjust if using different icons
import { loginFeatur } from '../../config/UI-config/RoleConfig'; 
import type { AuthComponentProps, ILogin}  from '../../types/auth.types'
import {Input} from '../ui/Inputs';
import { loginSchema } from '../../utility/validateForm';
import { Link } from 'react-router-dom';



export const LoginComponent: React.FC<AuthComponentProps> = ({ onSubmit, onGoogleAuth }) => {

  const [isLoading,setIsLoading]=useState(false)
  const [formData, setFormData] = useState<ILogin>({ email: '', password: '' });
  const [errors, setErrors] = useState<{[key:string]:string}>({})
  const currentRole = loginFeatur['login'];
  

  const updateFormData=(e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
    const {name,value}=e.target
    setFormData((prv)=>({...prv,[name]:value}))
    console.log(formData)
  }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const ERROR: { [key: string]: string } = {};

     
      const zodError = result.error

      
      zodError.issues.forEach((err) => {
        if (err.path[0]) {
          ERROR[err.path[0] as string] = err.message;
        }
      });

      setErrors(ERROR);
      return;
    }

  onSubmit(formData);
  setErrors({});
  setIsLoading(false);
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-400 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-5xl w-full">
        <div className="flex flex-col lg:flex-row">
          
          <div className={`lg:w-1/2 ${currentRole.color} p-8 flex flex-col justify-evenly items-center  text-white relative`}>
          <div className="flex items-center space-x-2 ">
            <div className="w-15 h-15 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Code className="w-10 h-10 text-white" />
            </div>
            <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TechMaster
            </span>
          </div>    
            {/* <div className="absolute inset-0 bg-black/1"></div> */}
            <div className="relative z-10 text-center">
              {/* <div className="text-6xl mb-6">{currentRole.illustration}</div> */}
              <img src={currentRole.illustration} alt="" />
              <h2 className="text-blue-800 dark:text-sky-600/100 text-3xl font-bold mb-4">Welcome Back!</h2>
              <p className=" text-blue-800 dark:text-sky-800/100 text-xl mb-8 opacity-90">Continue your journey with TechMaster</p>
             
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full" />
          </div>

          
          <div className="lg:w-1/2 p-8">
            <div className="max-w-md mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-600 p-3 rounded-xl">
                    <LogIn className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                <p className="text-gray-600">Sign in to your account</p>
              </div>
              <button
                type="button"
                onClick={() => onGoogleAuth('learner')}
                className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition mb-4 flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                </div>
              </div>

              {/* Login Form */}
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Email */}
                   <Input 
                     label='Email'
                     name='email'
                     placeholder='Enter your email'
                     type='email'
                     value={formData.email}
                     onChange={updateFormData}
                     error={errors.email}
                     icon={<Mail className="absolute  top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />}
                     
                    />

                {/* Password */}
                   <Input 
                     label='Password'
                     name='password'
                     placeholder='password'
                     type='password'
                     value={formData.password}
                     onChange={updateFormData}
                     error={errors.password}
                     icon={<Lock className="absolute  top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />}
                     showPasswordToggle
                     
                    />

                
                <div className="flex items-center justify-between">
                  {/* <label className="flex items-center">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label> */}
                  <Link to='/auth/forgot-password' className="text-sm text-blue-600 hover:underline">
                   Forgot password?
                  </Link>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-gradient-to-r ${currentRole.color} text-white py-3 px-4 rounded-lg  hover:opacity-90  disabled:opacity-50 font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300  disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center`}
                >
                  {isLoading && (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                     'Creating Account...'
                  </>
                )}
                Sign In
                </button>
              </form>

              <p className="text-center text-sm text-gray-600 mt-6">
                Don&apos;t have an account?{' '}
                <Link to='/auth/signup' className="text-blue-600 hover:underline font-medium"> Sign Up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};