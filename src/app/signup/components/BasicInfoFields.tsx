import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
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

interface BasicInfoFieldsProps {
  register: UseFormRegister<SignupFormData & { passwordConfirm: string }>;
  errors: Record<string, { message?: string }>;
  setValue: UseFormSetValue<SignupFormData & { passwordConfirm: string }>;
  gender: string;
}

const BasicInfoFields = ({
  register,
  errors,
  setValue,
}: BasicInfoFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">이름</label>
        <Input
          {...register("name", { required: "이름을 입력해주세요" })}
          type="text"
          placeholder="이름을 입력하세요"
          className="h-12 rounded-2xl border-gray-200"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">생년월일</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 text-gray-400 w-full" />
          <Input
            {...register("birthDate", {
              required: "생년월일을 입력해주세요",
              pattern: {
                value: /^\d{4}-\d{2}-\d{2}$/,
                message: "올바른 생년월일 형식이 아닙니다 (YYYY-MM-DD)",
              },
            })}
            type="date"
            max={new Date().toISOString().split("T")[0]}
            className="pl-10 h-12 rounded-2xl border-gray-200"
          />
          {errors.birthDate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.birthDate.message}
            </p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">성별</label>
        <Select
          onValueChange={(value) =>
            setValue("gender", value as "MALE" | "FEMALE")
          }
          required
        >
          <SelectTrigger className="h-12 rounded-2xl border-gray-200 w-full">
            <SelectValue placeholder="성별을 선택하세요" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl">
            <SelectItem value="MALE" className="rounded-xl">
              남성
            </SelectItem>
            <SelectItem value="FEMALE" className="rounded-xl">
              여성
            </SelectItem>
          </SelectContent>
        </Select>
        {errors.gender && (
          <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
        )}
      </div>
    </>
  );
};

export default BasicInfoFields;
