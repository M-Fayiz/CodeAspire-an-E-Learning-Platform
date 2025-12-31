import { ArrowLeft } from "lucide-react";
import {  useNavigate } from "react-router-dom";



const BackTo = () => {
  const navigate = useNavigate();
 
  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-sm  text-gray-600 hover:text-orange-500 transition"
    >
      <ArrowLeft size={16} />
      <span>Back </span>
    </button>
  );
};

export default BackTo;
