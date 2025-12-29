import { Lock } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/Inputs";
import { validatePassword } from "../../schema/validateForm";
import UserService from "../../service/user.service";
import { Spinner } from "../templates/Spinner";
import type { TapsComp } from "../../pages/Profile Page/Profile";
import { toast } from "sonner";

interface PasswordChangeData {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}
interface passWordsProps {
  userId: string;
  setTabs: (tab: TapsComp) => void;
}
export const PasswordChangeForm: React.FC<passWordsProps> = ({
  userId,
  setTabs,
}) => {
  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleValidation = () => {
    let errors: { [key: string]: string } = {};

    if (passwordData.currentPassword.trim() == "") {
      errors.currentPassword = "please insert your Current Password";
    } else if (passwordData.password.trim() == "") {
      errors.password = "please insert your new Password";
    } else {
      errors = validatePassword(
        passwordData.password,
        passwordData.confirmPassword,
      );
    }
    return errors;
  };

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validateError = handleValidation();

    if (Object.keys(validateError).length > 0) {
      setErrors(validateError);
      return;
    }

    try {
      setIsLoading(true);
      const result = await UserService.changePassword(
        userId,
        passwordData.currentPassword,
        passwordData.password,
      );
      if (result) {
        toast.success("Password Successfully Updated");

        setTabs("profile");
        setIsLoading(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        setIsLoading(false);
      }
    }
  };
  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setPasswordData((prv) => ({ ...prv, [name]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Lock className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Current Password"
          name="currentPassword"
          value={passwordData.currentPassword}
          placeholder="Current Password"
          onChange={handleChange}
          type="password"
          showPasswordToggle
          error={errors.currentPassword}
        />
        <Input
          label="New Password *"
          name="password"
          value={passwordData.password}
          placeholder="New Password"
          onChange={handleChange}
          type="password"
          showPasswordToggle
          error={errors.password}
        />
        <Input
          label="Confirm New Password *"
          name="confirmPassword"
          value={passwordData.confirmPassword}
          placeholder="Confirm Password"
          onChange={handleChange}
          type="password"
          showPasswordToggle
          error={errors.confirmPassword}
        />
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 flex-1 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading && <Spinner variant="white" size="small" />}
            <span>{isLoading ? "Updating..." : "Update Password"}</span>
          </button>

          <button
            type="button"
            // onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
