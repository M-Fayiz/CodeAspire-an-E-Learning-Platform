import { GraduationCap,UserCheck } from "lucide-react";

const RoleSelection: React.FC<{
  selectedRole: 'student' | 'mentor';
  onRoleChange: (role: 'student' | 'mentor') => void;
}> = ({ selectedRole, onRoleChange }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <button
        type="button"
        onClick={() => onRoleChange('student')}
        className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
          selectedRole === 'student'
            ? 'border-white bg-white/20 text-white'
            : 'border-white/20 text-gray-300 hover:border-white/50'
        }`}
      >
        <GraduationCap className="w-8 h-8 mx-auto mb-3" />
        <div className="font-semibold">I'm a Student</div>
        <div className="text-sm opacity-80">Ready to learn</div>
      </button>
      
      <button
        type="button"
        onClick={() => onRoleChange('mentor')}
        className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
          selectedRole === 'mentor'
            ? 'border-white bg-white/20 text-white'
            : 'border-white/20 text-gray-300 hover:border-white/50'
        }`}
      >
        <UserCheck className="w-8 h-8 mx-auto mb-3" />
        <div className="font-semibold">I'm a Mentor</div>
        <div className="text-sm opacity-80">Ready to teach</div>
      </button>
    </div>
  );
};

export default RoleSelection