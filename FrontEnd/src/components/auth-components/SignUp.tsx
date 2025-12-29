import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  UserPlus,
  Phone,
  Code,
  GraduationCap,
  Users,
} from "lucide-react";
import type { AuthComponentProps, ISignUp } from "../../types/auth.types";

import { Input } from "../ui/Inputs";
import { registrationSchema } from "../../schema/auth.schema";
import { Link } from "react-router-dom";

const SignupComponent: React.FC<AuthComponentProps> = ({
  onSubmit,
  onGoogleAuth,
}) => {
  const [selectedRole, setSelectedRole] = useState<"learner" | "mentor">(
    "learner",
  );
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<ISignUp>({
    name: "",
    email: "",
    phone: "",
    role: "learner",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const updateFormData = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prv) => ({ ...prv, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const roleAdded = { ...formData, role: selectedRole };
    const result = registrationSchema.safeParse(roleAdded);
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
    setErrors({});
    onSubmit(roleAdded);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-orange-100 via-white to-orange-50 flex items-center justify-center px-6 py-12 overflow-hidden">
      <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-orange-300 opacity-30 blur-3xl rounded-full"></div>
      <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-yellow-200 opacity-40 blur-3xl rounded-full"></div>

      <div className="relative flex flex-col lg:flex-row items-center justify-between w-full max-w-6xl gap-10 z-10">
        <div className="lg:w-1/2 text-center lg:text-left space-y-8 px-4">
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-lg">
              <Code className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
              CodeAspire
            </h1>
          </div>

          <div className="space-y-6">
            <h1
              style={{ fontFamily: "Orbitron, sans-serif" }}
              className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-yellow-500 leading-tight"
            >
              “Every great journey begins <br /> with a single commit.”
            </h1>
            <p className="text-gray-600 text-lg max-w-md mx-auto lg:mx-0 leading-relaxed">
              Continue your journey with{" "}
              <span className="text-orange-600 font-semibold">CodeAspire</span>.
              Let’s build something amazing together.
            </p>
          </div>

          <h2 className="text-3xl font-semibold text-orange-600 mt-8">
            Join Us Today!
          </h2>
        </div>

        <div className=" max-w-lg bg-white/40 backdrop-blur-2xl rounded-3xl shadow-xl p-10 border border-white/30 hover:shadow-2xl ">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-2xl shadow-md">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Create Account
            </h1>
            <p className="text-gray-500 text-sm">
              Choose your role to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="flex gap-3">
              <Input
                label="Your Name"
                name="name"
                placeholder="Enter your name"
                type="text"
                value={formData.name || ""}
                onChange={updateFormData}
                error={errors.name}
                icon={
                  <User className="absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                }
              />
              <Input
                label="Phone"
                name="phone"
                placeholder="Phone Number"
                type="tel"
                value={formData.phone || ""}
                onChange={updateFormData}
                error={errors.phone}
                icon={
                  <Phone className="absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                }
              />
            </div>

            <Input
              label="Email"
              name="email"
              placeholder="Enter your email"
              type="email"
              value={formData.email}
              onChange={updateFormData}
              error={errors.email}
              icon={
                <Mail className="absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              }
            />

            <div className="flex gap-3">
              <Input
                label="Password"
                name="password"
                placeholder="Enter your password"
                type="password"
                value={formData.password}
                onChange={updateFormData}
                error={errors.password}
                icon={
                  <Lock className="absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                }
                showPasswordToggle
              />
              <Input
                label="Confirm Password"
                name="confirmPassword"
                placeholder="Confirm password"
                type="password"
                value={formData.confirmPassword || ""}
                onChange={updateFormData}
                error={errors.confirmPassword}
                icon={
                  <Lock className="absolute  top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                }
                showPasswordToggle
              />
            </div>

            <div className="grid grid-cols-2 gap-2 mb-6">
              <>
                <button
                  type="button"
                  key={"learner"}
                  onClick={() => setSelectedRole("learner")}
                  className={`p-3 rounded-lg border-2 transition-all duration-300 text-gray-500 ${
                    selectedRole === "learner"
                      ? "border-orange-500 bg-orange-50 text-orange-700 shadow-md"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 "
                  }`}
                >
                  <GraduationCap className="w-5 h-5 mx-auto mb-1 " />
                  <span className="text-xs font-medium capitalize">
                    Learner
                  </span>
                </button>
                <button
                  type="button"
                  key={"mentor"}
                  onClick={() => setSelectedRole("mentor")}
                  className={`p-3 rounded-lg border-2 transition-all duration-300 text-gray-500 ${
                    selectedRole === "mentor"
                      ? "border-orange-500 bg-orange-50 text-orange-700 shadow-md"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Users className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs font-medium capitalize">Mentor</span>
                </button>
              </>
            </div>

            <button
              type="button"
              onClick={() => onGoogleAuth(selectedRole)}
              className="w-full bg-white/70 border border-gray-200 text-gray-700 py-3 px-4 rounded-full font-medium hover:bg-white hover:shadow-md transition flex items-center justify-center space-x-2 mb-4 backdrop-blur-sm"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
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

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r bg-orange-500 text-white py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-[1.03] transition-all duration-300 disabled:opacity-50 flex items-center justify-center`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="text-orange-600 hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupComponent;
// Login Component
