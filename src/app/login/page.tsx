"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CommonHeader from "@/components/common/CommonHeader";
import { login } from "./api/login";
import { useAuthStore } from "@/store/auth";
import LoginForm from "./components/LoginForm";

export default function LoginPage() {
  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUser = useAuthStore((state) => state.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await login({ email, password });
      if (response.accessToken) {
        setAccessToken(response.accessToken);
        setUser(response.user);
        router.push("/home");
      } else {
        alert("이메일 또는 비밀번호가 올바르지 않습니다.");
      }
    } catch (error) {
      alert("이메일 또는 비밀번호가 올바르지 않습니다.");
      console.error("로그인 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black max-w-md mx-auto flex flex-col">
      <CommonHeader text="로그인" />
      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">환영합니다!</h2>
          <p className="text-gray-600">
            마라톤 기록을 등록하고 순위를 확인 해보세요
          </p>
        </div>

        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          isLoading={isLoading}
          onLogin={handleLogin}
        />
      </div>

      {/* Footer */}
      <div className="p-4 text-center">
        <p className="text-xs text-gray-500">
          로그인하여 나의 마라톤 기록을 관리하세요
        </p>
      </div>
    </div>
  );
}
