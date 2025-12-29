import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface BackToState {
  backTo?: {
    path: string;
    label: string;
  };
}

const BackTo = ({
  fallbackPath = "/my-courses",
  fallbackLabel = "My Courses",
}: {
  fallbackPath?: string;
  fallbackLabel?: string;
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as BackToState;

  const path = state?.backTo?.path ?? fallbackPath;
  const label = state?.backTo?.label ?? fallbackLabel;

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
