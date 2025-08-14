import type { ReactNode } from "react";

interface TapsProps {
  Click: (tap: string) => void;
  label: string;
  tap: String;
  icon: ReactNode;
  activeTap: string;
}

function Taps({ Click, label, tap, activeTap, icon }: TapsProps) {
  return (
    <div>
      <button
        type="button"
        onClick={() => Click(tap as string)}
        className={`flex-shrink-0 min-w-fit flex items-center gap-1.5 px-3 sm:px-6 py-2 sm:py-3 text-sm truncate snap-start font-medium border-b-2 ${
          activeTap === tap
            ? "border-blue-500 text-gray-900 bg-white"
            : "border-transparent text-gray-500 hover:text-gray-700"
        }`}
      >
        {icon}
        {label}
      </button>
    </div>
  );
}

export default Taps;
