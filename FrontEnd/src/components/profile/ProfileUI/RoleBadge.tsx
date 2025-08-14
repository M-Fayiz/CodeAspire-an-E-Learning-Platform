import { BookOpen, Shield, User, Users } from "lucide-react";

const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "mentor":
        return "bg-green-100 text-green-800";
      case "learner":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="w-4 h-4" />;
      case "mentor":
        return <Users className="w-4 h-4" />;
      case "learner":
        return <BookOpen className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(role)}`}
    >
      {getRoleIcon(role)}
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
};

export default RoleBadge;
