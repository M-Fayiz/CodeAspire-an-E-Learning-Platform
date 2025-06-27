import { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { checkPasswordStrength } from '../../utility/validateForm';
import { useSearchParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../service/client/auth.service';
import { toastService } from '../toast/ToastSystem';
import { Spinner } from '../templates/Spinner';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const navigate=useNavigate()
  const [params]=useSearchParams()
  const token=params.get('token')
  const email=params.get('email')

  const validatePassword = (password: string) => {
    const newErrors: {[key: string]: string} = {};

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    checkPasswordStrength(formData.password).filter(req=>{
         if(req.passed==false) newErrors.password=req.text
    })

    return newErrors;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validatePassword(formData.password);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
     
    if(!email||!token){
        toastService.error('Invalid or Missing Like , Please try again')
        return
    }

    try {
        const result =await AuthService.resetPassword(email,token,formData.password)
         if(result){

            toastService.success('Password Reseted Succesfully!')
            setTimeout(()=>{
                setIsLoading(false)
                navigate('/auth/login',{replace:true})

            },3000)
         }
    } catch (error) {
        if(error instanceof Error){
            toastService.error(error.message)
        }
    }

   
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 w-full max-w-lg">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Reset Your Password
          </h1>
          
          <p className="text-gray-600 leading-relaxed">
            Please enter your new password below. Make sure it's strong and secure.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full px-4 py-3 pl-12 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.password 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                }`}
                placeholder="Enter your new password"
              />
              <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                errors.password ? 'text-red-400' : 'text-gray-400'
              }`} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <div className="flex items-center mt-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.password}
              </div>
            )}
          </div>
          {formData.password && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Password Requirements:</h4>
              <div className="space-y-2">
                {checkPasswordStrength(formData.password).map((req) => {
                  return (
                    <div key={req.id} className="flex items-center text-sm">
                      <div className={`w-4 h-4 rounded-full mr-3 flex items-center justify-center ${
                         req.passed ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        { req.passed && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                      <span className={ req.passed ? 'text-green-600' : 'text-gray-600'}>
                        {req.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`w-full px-4 py-3 pl-12 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.confirmPassword 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                }`}
                placeholder="Confirm your new password"
              />
              <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                errors.confirmPassword ? 'text-red-400' : 'text-gray-400'
              }`} />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="flex items-center mt-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.confirmPassword}
              </div>
            )}
            {formData.confirmPassword && formData.password === formData.confirmPassword && (
              <div className="flex items-center mt-2 text-green-600 text-sm">
                <CheckCircle className="w-4 h-4 mr-1" />
                Passwords match
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !formData.password || !formData.confirmPassword}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Resetting Password...
              </div>
            ) : (
              'Reset Password'
            )}
          </button>
        </div>
      </div>
      {isLoading&&<Spinner fullScreen variant='theme'/>}
    </div>

  );
};

export default ResetPassword;