import React, { useState } from 'react';
import { Mail, ArrowLeft, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom'
import { AuthService } from '../../service/client-API/auth.service';
import SuccessModal from '../templates/SuccessModal';
import { toastService } from '../toast/ToastSystem';


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalEmail,setModalEmail]=useState('')
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const closeModal=()=>{

    setShowModal(false)
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    try {
        setIsLoading(true);
        const result=await AuthService.forgotPassword(email)
        if(result){
          setModalEmail(result.email)
          setShowModal(true)
        }
        setIsLoading(false)
    } catch (error) {

        setIsLoading(false);
        if(error instanceof Error){
          error.message+=' ,Please Register'
          toastService.error(error.message)
        }
    }


     
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 w-full max-w-md">
   
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Forgot Password?
          </h1>
          
          <p className="text-gray-600 leading-relaxed">
            No worries! Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

            <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 pl-12 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                  error 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                }`}
                placeholder="Enter your email address"
              />
              <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                error ? 'text-red-400' : 'text-gray-400'
              }`} />
            </div>
            {error && (
              <div className="flex items-center mt-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Sending Reset Link...
              </div>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </div>
          </form>

      
        <div className="mt-8 text-center">
          <button
            className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /><Link to='/auth/login'> Back to Login</Link>
           
          </button>
        </div>
      </div>
      <SuccessModal
        show={showModal}
        title="Reset Link Sent!"
        message="We’ve sent a password reset link to your email. Please check your inbox and follow the instructions. The link will expire in 5 minutes."
        email={modalEmail || ''}
        onClose={closeModal}
        showCloseButton={true}
        autoClose={false}
        autoCloseDelay={5000}
      />

    </div>
  );
};

export default ForgotPassword;