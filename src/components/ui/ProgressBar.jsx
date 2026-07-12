import React from "react";

export function ProgressBar({ progress = 0 }) {
  return (
    <div className="w-full bg-[#24283b] rounded-full h-1.5 overflow-hidden">
      <div
        className="bg-[#4f46e5] h-1.5 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
export default ProgressBar;
