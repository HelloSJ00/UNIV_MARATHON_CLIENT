"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock } from "lucide-react";
import LoginHeader from "./components/LoginHeader";
import Link from "next/link";
import { login } from "@/app/api/login";
import { useAuthStore } from "@/store/auth";

export default function LoginPage() {
  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await login({ email, password });
      const { accessToken } = response;
      setAccessToken(accessToken);
      router.replace("/home");
    } catch (error) {
      console.error("로그인 실패:", error);
      // TODO: 에러 메시지 표시
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black max-w-md mx-auto flex flex-col">
      <LoginHeader />
      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">환영합니다!</h2>
          <p className="text-gray-600">마라톤 기록을 등록하고 관리해보세요</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 mb-8">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">이메일</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="email"
                placeholder="이메일을 입력하세요"
                className="pl-10 h-12 rounded-2xl border-gray-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="password"
                placeholder="비밀번호를 입력하세요"
                className="pl-10 h-12 rounded-2xl border-gray-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            className="w-full h-14 bg-black text-white hover:bg-gray-800 rounded-2xl text-lg font-medium mb-4"
            disabled={isLoading}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">또는</span>
          </div>
        </div>

        {/* Kakao Login Button */}
        <Button
          className="w-full h-14 bg-[#FEE500] text-black hover:bg-[#FDD835] rounded-2xl text-lg font-medium mb-4 flex items-center justify-center gap-3"
          onClick={() => {
            // 카카오 로그인 로직 구현
            console.log("카카오 로그인 시도");
          }}
        >
          <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
            <span className="text-[#FEE500] font-bold text-sm">K</span>
          </div>
          카카오로 로그인하기
        </Button>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-gray-600">
            계정이 없으신가요?{" "}
            <Link
              href="/signup"
              className="text-black font-medium hover:underline ml-1"
            >
              회원가입
            </Link>
          </p>
        </div>
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
