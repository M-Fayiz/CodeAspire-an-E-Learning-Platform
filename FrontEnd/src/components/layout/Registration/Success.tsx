import { CheckCircle } from "lucide-react";

interface SuccessPrps{
    show:boolean,
    email?:string
}

const SuccessAnimation: React.FC<SuccessPrps> = ({ show,email }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 text-center max-w-md mx-4 transform animate-bounce">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to TechMaster!</h3>
        <p className="text-gray-600"> We have sent a message to {email} For the verification <br /> Check your email to verify your account.</p>
      </div>
    </div>
  );
};
export default SuccessAnimation