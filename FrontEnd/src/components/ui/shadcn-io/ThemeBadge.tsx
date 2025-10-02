interface BadgeProps {
  label: string;
  type?: "success" | "warning" | "info" | "default";
}

export function Badge({ label, type = "default" }: BadgeProps) {
  const styles: Record<string, string> = {
    default: "bg-gray-100 text-gray-700 border border-gray-300",
    success: "bg-orange-100 text-orange-600 border border-orange-300",
    warning: "bg-black text-white border border-black",
    info: "bg-gray-800 text-white border border-gray-800",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${styles[type]}`}
    >
      {label}
    </span>
  );
}
