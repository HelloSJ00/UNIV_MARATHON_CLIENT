import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, X, Loader2 } from "lucide-react";
import React from "react";
import { UseFormRegister } from "react-hook-form";

interface SignupFormData {
  email: string;
  name: string;
  password: string;
  birthDate: string;
  gender: "MALE" | "FEMALE";
  studentId: string;
  university: string;
  major: string;
  profileImage: FileList;
}
interface EmailInputWithCheckProps {
  email: string;
  setEmail: (email: string) => void;
  register: UseFormRegister<SignupFormData & { passwordConfirm: string }>;
  errors: Record<string, { message?: string }>;
  handleEmailCheck: () => void;
  isCheckingEmail: boolean;
  emailCheckResult: "none" | "available" | "taken";
}

const EmailInputWithCheck = ({
  email,
  setEmail,
  register,
  errors,
  handleEmailCheck,
  isCheckingEmail,
  emailCheckResult,
}: EmailInputWithCheckProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        이메일 (로그인 ID)
      </label>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="email"
            placeholder="이메일을 입력하세요"
            className="pl-10 h-12 rounded-2xl border-gray-200"
            required
            {...register("email", {
              required: "이메일을 입력해주세요",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "올바른 이메일 형식이 아닙니다",
              },
              onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value),
            })}
          />
        </div>
        <Button
          type="button"
          onClick={handleEmailCheck}
          disabled={!email || isCheckingEmail}
          className="h-12 px-4 bg-black text-white hover:bg-gray-800 rounded-2xl whitespace-nowrap"
        >
          {isCheckingEmail ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "중복확인"
          )}
        </Button>
      </div>
      {/* 중복체크 결과 */}
      {emailCheckResult === "available" && (
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <CheckCircle className="w-4 h-4" />
          <span>사용 가능한 이메일입니다.</span>
        </div>
      )}
      {emailCheckResult === "taken" && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <X className="w-4 h-4" />
          <span>이미 사용중인 이메일입니다.</span>
        </div>
      )}
      {errors.email && (
        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
      )}
    </div>
  );
};

export default EmailInputWithCheck;
