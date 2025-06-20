import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { UseFormSetValue, UseFormRegister } from "react-hook-form";

// SignupFormData 타입을 직접 정의
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

interface StudentIdSelectProps {
  register: UseFormRegister<SignupFormData & { passwordConfirm: string }>;
  errors: Record<string, { message?: string }>;
  setValue: UseFormSetValue<SignupFormData & { passwordConfirm: string }>;
}

function StudentIdSelect({ register, errors, setValue }: StudentIdSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">학번</label>
      <Select
        onValueChange={(value) =>
          setValue("studentId" as keyof SignupFormData, value)
        }
        required
      >
        <SelectTrigger className="h-12 rounded-2xl border-gray-200 w-full">
          <SelectValue placeholder="입학년도를 선택하세요" />
        </SelectTrigger>
        <SelectContent className="rounded-2xl">
          {Array.from({ length: 20 }, (_, i) => 2025 - i).map((year) => (
            <SelectItem
              key={year}
              value={year.toString()}
              className="rounded-xl"
              {...register("studentId", { required: "학번을 선택하세요" })}
            >
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors.studentId && (
        <p className="text-red-500 text-sm mt-1">{errors.studentId.message}</p>
      )}
    </div>
  );
}

export default StudentIdSelect;
