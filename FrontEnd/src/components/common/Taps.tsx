import type { ReactNode } from "react";

interface TapsProps {
  Click: (tap: string) => void;
  label: string;
  tap: string;
  icon: ReactNode;
  activeTap: string;
}

function Taps({ Click, label, tap, activeTap, icon }: TapsProps) {
  return (
    <div>
      <button
  type="button"
  onClick={() => Click(tap as string)}
  className={`flex-shrink-0 min-w-fit inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium rounded-lg transition-all duration-200 align-middle ${
    activeTap === tap
      ? "bg-orange-500 text-white shadow-md"
      : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
  }`}
>
  {icon && (
    <span className="flex items-center justify-center w-4 h-4">
      {icon}
    </span>
  )}
  <span className="leading-none">{label}</span>
</button>

    </div>
  );
}

export default Taps;
