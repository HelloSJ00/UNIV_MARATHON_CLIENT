import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";
import React from "react";
import { UseFormRegister } from "react-hook-form";
import { SignupForm } from "../api/reqSignup";

interface PasswordFieldsProps {
  register: UseFormRegister<SignupForm & { passwordConfirm: string }>;
  errors: Record<string, { message?: string }>;
  password: string;
}

const PasswordFields = ({
  register,
  errors,
  password,
}: PasswordFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">비밀번호</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            {...register("password", {
              required: "비밀번호를 입력해주세요",
            })}
            type="password"
            placeholder="비밀번호를 입력하세요"
            className="pl-10 h-12 rounded-2xl border-gray-200"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          비밀번호 확인
        </label>
        <Input
          type="password"
          placeholder="비밀번호를 다시 입력하세요"
          {...register("passwordConfirm", {
            required: "비밀번호 확인을 입력하세요.",
            validate: (value: string) =>
              value === password || "비밀번호가 일치하지 않습니다.",
          })}
          className="h-12 rounded-2xl border-gray-200"
          required
        />
        {errors.passwordConfirm && (
          <p className="text-xs text-red-500 mt-1">
            {errors.passwordConfirm.message}
          </p>
        )}
      </div>
    </>
  );
};

export default PasswordFields;
