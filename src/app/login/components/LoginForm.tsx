import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock } from "lucide-react";
import Link from "next/link";
import React from "react";

interface LoginFormProps {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  isLoading: boolean;
  onLogin: (e: React.FormEvent) => void;
}

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  isLoading,
  onLogin,
}: LoginFormProps) {
  return (
    <form onSubmit={onLogin} className="space-y-4 mb-8">
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
        <label className="text-sm font-medium text-gray-700">비밀번호</label>
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
      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">또는</span>
        </div>
      </div>
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
    </form>
  );
}
