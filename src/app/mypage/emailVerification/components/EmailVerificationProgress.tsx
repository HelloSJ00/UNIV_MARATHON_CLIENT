import React from "react";

interface EmailVerificationProgressProps {
  step: number;
}

const EmailVerificationProgress = ({
  step,
}: EmailVerificationProgressProps) => (
  <div className="flex items-center justify-center mb-8">
    <div className="flex items-center space-x-4">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          step >= 1 ? "bg-black text-white" : "bg-gray-200 text-gray-500"
        }`}
      >
        1
      </div>
      <div
        className={`w-12 h-1 ${step >= 2 ? "bg-black" : "bg-gray-200"}`}
      ></div>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          step >= 2 ? "bg-black text-white" : "bg-gray-200 text-gray-500"
        }`}
      >
        2
      </div>
      <div
        className={`w-12 h-1 ${step >= 3 ? "bg-black" : "bg-gray-200"}`}
      ></div>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          step >= 3 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
        }`}
      >
        ✓
      </div>
    </div>
  </div>
);

export default EmailVerificationProgress;
