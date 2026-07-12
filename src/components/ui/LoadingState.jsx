import React from "react";

export function LoadingState({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-[#a9b1d6]">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#4f46e5] mb-3" />
      <span className="text-xs">{message}</span>
    </div>
  );
}
export default LoadingState;
