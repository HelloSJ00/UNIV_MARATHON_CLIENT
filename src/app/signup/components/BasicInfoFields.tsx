import { Input } from "@/components/ui/input";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState, useEffect } from "react";
import { SignupForm } from "../api/reqSignup";

interface BasicInfoFieldsProps {
  register: UseFormRegister<SignupForm & { passwordConfirm: string }>;
  errors: Record<string, { message?: string }>;
  setValue: UseFormSetValue<SignupForm & { passwordConfirm: string }>;
  gender: string;
}

const BasicInfoFields = ({
  register,
  errors,
  setValue,
}: BasicInfoFieldsProps) => {
  const [birthYear, setBirthYear] = useState<string | null>(null);
  const [birthMonth, setBirthMonth] = useState<string | null>(null);
  const [birthDay, setBirthDay] = useState<string | null>(null);

  // 생년월일이 변경될 때마다 react-hook-form의 'birthDate' 필드 값을 업데이트
  useEffect(() => {
    if (birthYear && birthMonth && birthDay) {
      const month = birthMonth.padStart(2, "0");
      const day = birthDay.padStart(2, "0");
      setValue("birthDate", `${birthYear}-${month}-${day}`, {
        shouldValidate: true,
      });
    }
  }, [birthYear, birthMonth, birthDay, setValue]);

  // 년/월/일 옵션 생성
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

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
        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-500">이름 공개 여부</label>
          <Select
            defaultValue="public"
            onValueChange={(value) =>
              setValue("isNameVisible", value === "public")
            }
          >
            <SelectTrigger className="w-20 h-7 rounded-lg border-gray-200 bg-white text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-lg">
              <SelectItem value="public" className="rounded-md text-xs">
                공개
              </SelectItem>
              <SelectItem value="private" className="rounded-md text-xs">
                비공개
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">생년월일</label>
        <div className="flex gap-2">
          {/* 년 */}
          <Select onValueChange={setBirthYear}>
            <SelectTrigger className="h-12 rounded-2xl border-gray-200">
              <SelectValue placeholder="년" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              {years.map((year) => (
                <SelectItem
                  key={year}
                  value={String(year)}
                  className="rounded-xl"
                >
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* 월 */}
          <Select onValueChange={setBirthMonth}>
            <SelectTrigger className="h-12 rounded-2xl border-gray-200">
              <SelectValue placeholder="월" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              {months.map((month) => (
                <SelectItem
                  key={month}
                  value={String(month)}
                  className="rounded-xl"
                >
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* 일 */}
          <Select onValueChange={setBirthDay}>
            <SelectTrigger className="h-12 rounded-2xl border-gray-200">
              <SelectValue placeholder="일" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              {days.map((day) => (
                <SelectItem
                  key={day}
                  value={String(day)}
                  className="rounded-xl"
                >
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {errors.birthDate && (
          <p className="text-red-500 text-sm mt-1">
            {errors.birthDate.message}
          </p>
        )}
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
