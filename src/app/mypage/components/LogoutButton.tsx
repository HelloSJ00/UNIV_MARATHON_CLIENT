import React from "react";

interface LogoutButtonProps {
  onLogout: () => void;
}

export default function LogoutButton({ onLogout }: LogoutButtonProps) {
  return (
    <div className="mt-4">
      <button
        onClick={onLogout}
        className="w-full py-4 text-red-600 font-medium text-center border border-red-600 rounded-2xl hover:bg-red-50 transition-colors"
      >
        로그아웃
      </button>
    </div>
  );
}
