import React from "react";

type SpinnerSize = "small" | "medium" | "large" | "xlarge";
type SpinnerVariant = "theme" | "white" | "tech";

interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  fullScreen?: boolean;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "medium",
  variant = "theme",
  fullScreen = false,
  className = "",
}) => {
  const sizeClasses: Record<SpinnerSize, string> = {
    small: "w-4 h-4",
    medium: "w-6 h-6",
    large: "w-12 h-12",
    xlarge: "w-16 h-16",
  };

  const spinnerElement = (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div
        className="w-full h-full border-4 rounded-full animate-spin"
        style={{
          borderColor:
            variant === "theme"
              ? "#e5e7eb"
              : variant === "white"
                ? "rgba(255,255,255,0.3)"
                : "#e5e7eb",
          borderTopColor:
            variant === "theme"
              ? "#3b82f6"
              : variant === "white"
                ? "#ffffff"
                : "#60a5fa",
          animationDuration: "1s",
        }}
      />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-orange-500 animate-spin" />

          <p className="text-sm text-gray-600 font-medium">
            Loading, please wait...
          </p>
        </div>
      </div>
    );
  }

  return spinnerElement;
};
