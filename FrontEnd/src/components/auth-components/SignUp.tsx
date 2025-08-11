import React, { useState } from 'react';
import { User, Mail, Lock, UserPlus ,Phone} from 'lucide-react';
import type { AuthComponentProps,ISignUp } from '../../types/auth.types';
import { roleConfig } from '../../config/UI-config/RoleConfig'; 
import {Input} from '../ui/Inputs';
import { registrationSchema } from '../../schema/validateForm';
import { Link } from 'react-router-dom';


 const SignupComponent: React.FC<AuthComponentProps> = ({ onSubmit, onGoogleAuth}) => {
  const [selectedRole, setSelectedRole] = useState<'learner' | 'mentor'>('learner');
  const [isLoading,setIsLoading]=useState(false)
  type AvailableRoles = keyof typeof roleConfig;
  const currentRole = roleConfig[selectedRole];
  // const IconComponent = currentRole.icon;

  const [formData, setFormData] = useState<ISignUp>({
    name: '',
    email: '',
    phone: '',
    role:'learner',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<{[key:string]:string}>({})

   const updateFormData=(e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
      const {name,value}=e.target
      setFormData((prv)=>({...prv,[name]:value}))
      console.log(formData)
    }


   const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
      e.preventDefault()
      
      const roleAdded={...formData,role:selectedRole}
      const result=registrationSchema.safeParse(roleAdded)
      if(!result.success){
          const ERROR:{[key:string]:string}={}
          const zodError = result.error
          zodError.issues.forEach((err) => {
          if (err.path[0]) {
            ERROR[err.path[0] as string] = err.message;
          }
        });
        setErrors(ERROR)
        return
      }
      setErrors({})
      onSubmit(roleAdded);
      setIsLoading(true)

      setTimeout(()=>{
        setIsLoading(false)
      },3000)
   }   


  return (
    <div  >
      <div >
        <div className="flex flex-col lg:flex-row">
          
          <div className={`lg:w-1/2 bg-gradient-to-br ${currentRole.color} p-8 flex flex-col justify-center  items-center text-white relative overflow-hidden`}>
            <div className="absolute inset-0 bg-black/10"></div>
           <div className="flex items-center justify-center min-h-screen">
            <div className="relative z-10 text-center max-w-md">
              <img
                className="mx-auto mb-6 w-80" // Removed `text-6xl`, added `mx-auto` and specific width
                src={currentRole.illustration}
                alt="Role Illustration"
              />
              <h2 className="text-3xl font-bold mb-4">{currentRole.title}</h2>
              <p className="text-lg mb-8 opacity-90">{currentRole.message}</p>
              {/* <div className="space-y-1 flex text-sm">
                {currentRole.features.map((feature, index) => (
                  <div key={index} className="flex  items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full" />
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div> */}
            </div>
          </div>

          </div>

          <div className="lg:w-2/2 p-8">
            <div className="max-w-lg mx-auto">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-blue-600 p-3 rounded-xl">
                    <UserPlus className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
                <p className="text-gray-600">Choose your role to get started</p>
              </div>

            
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className=' flex gap-2'>
                   <Input
                     label='Your Name'
                     name='name'
                     placeholder='Enter your name'
                     type='text'
                     value={formData.name||''}
                     onChange={updateFormData}
                     error={errors.name}
                     icon={<User className="absolute  top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />}
                     
                    />
                   <Input
                     label='Phone'
                     name='phone'
                     placeholder='Phone Number'
                     type='tel'
                     value={formData.phone||''}
                     onChange={updateFormData}
                     error={errors.phone}
                     icon={<Phone className="absolute   top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />}
                     
                    />
                </div>    
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
                   
                <div className='flex gap-2'>

                
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
                

                <Input
                      label="Confirm Password"
                    type="password"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={formData.confirmPassword||''}
                    onChange={ updateFormData}
                    icon={<Lock className="absolute  top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />}
                    error={errors.confirmPassword}
                    showPasswordToggle
                     
                    />
                </div>
                

            
              <div className="grid grid-cols-2 gap-2 mb-6">
                {(Object.keys(roleConfig)as AvailableRoles[]).map((role) => {
                  const config = roleConfig[role];
                  const RoleIcon = config.icon;
                  return (
                    <button
                     type='button'
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        selectedRole === role
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <RoleIcon className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-xs font-medium capitalize">{role}</span>
                    </button>
                  );
                })}
              </div>

              
              <button
               type='button'
                onClick={() => onGoogleAuth(selectedRole)}
                className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors mb-4 flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </button>
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
                Sign Up
                </button>
              </form>

              <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account?{' '}
                <Link to='/auth/login' className="text-blue-600 hover:underline font-medium"> Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupComponent
// Login Component

