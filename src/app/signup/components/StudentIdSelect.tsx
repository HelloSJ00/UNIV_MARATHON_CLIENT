import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { UseFormSetValue, UseFormRegister } from "react-hook-form";
import { SignupForm } from "../api/reqSignup";

interface StudentIdSelectProps {
  register: UseFormRegister<SignupForm & { passwordConfirm: string }>;
  errors: Record<string, { message?: string }>;
  setValue: UseFormSetValue<SignupForm & { passwordConfirm: string }>;
}

function StudentIdSelect({ register, errors, setValue }: StudentIdSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">학번</label>
      <Select
        onValueChange={(value) => setValue("studentNumber", value)}
        required
      >
        <SelectTrigger className="h-12 rounded-2xl border-gray-200 w-full">
          <SelectValue placeholder="입학년도를 선택하세요" />
        </SelectTrigger>
        <SelectContent className="rounded-2xl">
          {Array.from({ length: 30 }, (_, i) => 2025 - i).map((year) => (
            <SelectItem
              key={year}
              value={year.toString()}
              className="rounded-xl"
              {...register("studentNumber", { required: "학번을 선택하세요" })}
            >
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors.studentNumber && (
        <p className="text-red-500 text-sm mt-1">
          {errors.studentNumber.message}
        </p>
      )}
      <div className="flex items-center justify-between">
        <label className="text-xs text-gray-500">학번 공개 여부</label>
        <Select
          defaultValue="public"
          onValueChange={(value) =>
            setValue("isStudentNumberVisible", value === "public")
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
  );
}

export default StudentIdSelect;
