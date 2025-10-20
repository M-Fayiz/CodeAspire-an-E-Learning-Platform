import React, { useState } from "react";
import { LogIn, Mail, Lock, Code } from "lucide-react"
import type { AuthComponentProps, ILogin } from "../../types/auth.types";
import { Input } from "../ui/Inputs";
import { loginSchema } from "../../schema/validateForm";
import { Link } from "react-router-dom";

export const LoginComponent: React.FC<AuthComponentProps> = ({
  onSubmit,
  onGoogleAuth,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ILogin>({ email: "", password: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});


  const updateFormData = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prv) => ({ ...prv, [name]: value }));
    console.log(formData);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const ERROR: { [key: string]: string } = {};

      const zodError = result.error;

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
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-gray-100 flex items-center justify-center px-6 py-10 relative overflow-hidden">

      {/* Subtle floating gradient blob */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-orange-300 opacity-30 blur-3xl rounded-full"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-yellow-200 opacity-40 blur-3xl rounded-full"></div>

      <div className="flex flex-col lg:flex-row w-full max-w-6xl items-center justify-between">
        {/* Left side: brand + quote */}
        <div className="lg:w-1/2 text-center lg:text-left space-y-8 z-10 px-4">
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
              <Code className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 tracking-tight">CodeAspire</h1>
          </div>

          <div className="space-y-6">
            <h1
              style={{ fontFamily: "Orbitron, sans-serif" }}
              className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-yellow-500 leading-tight"
            >
              “Every great journey begins <br /> with a single commit.”
            </h1>
            <p className="text-gray-600 text-lg max-w-md mx-auto lg:mx-0 leading-relaxed">
              Continue your journey with <span className="text-orange-600 font-semibold">CodeAspire</span>.  
              Let’s build something amazing together.
            </p>
          </div>

          <h2 className="text-3xl font-semibold text-orange-600 mt-8">Welcome Back!</h2>
        </div>

        {/* Right side: floating glass form */}
        <div className="lg:w-1/2 w-full max-w-md bg-white/40 backdrop-blur-2xl rounded-[2rem] shadow-xl p-10 border border-white/30 z-10 hover:shadow-2xl transition duration-500 ease-in-out transform hover:scale-[1.02]">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-2xl shadow-md">
                <LogIn className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-gray-500 text-sm">Sign in to continue your journey</p>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={() => onGoogleAuth("learner")}
            className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3 px-4 rounded-full font-medium hover:bg-gray-50 transition-colors mb-4 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/40"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white/60 text-gray-600 backdrop-blur-md">
                or continue with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Email"
              name="email"
              placeholder="Enter your email"
              type="email"
              value={formData.email}
              onChange={updateFormData}
              error={errors.email}
              icon={<Mail className="absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />}
            />

            <Input
              label="Password"
              name="password"
              placeholder="Enter your password"
              type="password"
              value={formData.password}
              onChange={updateFormData}
              error={errors.password}
              icon={<Lock className="absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />}
              showPasswordToggle
            />

            <div className="flex items-center justify-between text-sm">
              <Link
                to="/auth/forgot-password"
                className="text-orange-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-[1.03] transition-all duration-300 flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don’t have an account?{" "}
            <Link
              to="/auth/signup"
              className="text-orange-600 hover:underline font-medium"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>

  );
};
