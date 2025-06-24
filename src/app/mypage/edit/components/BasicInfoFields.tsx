import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

interface BasicInfoFieldsProps {
  formData: {
    name: string;
    gender: "MALE" | "FEMALE";
    universityEmail: string;
    studentNumber: string;
    isNameVisible: boolean;
    isStudentNumberVisible: boolean;
  };
  onInputChange: (field: string, value: string | boolean) => void;
  userEmail: string;
}

export default function BasicInfoFields({
  formData,
  onInputChange,
  userEmail,
}: BasicInfoFieldsProps) {
  return (
    <div className="space-y-4">
      {/* 이메일 (수정 불가) */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          이메일 (변경 불가)
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="email"
            value={userEmail}
            disabled
            className="pl-10 h-12 rounded-2xl border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
          />
        </div>
        <p className="text-xs text-gray-500">
          이메일은 로그인 ID로 사용되어 변경할 수 없습니다
        </p>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">이름</label>
        <Input
          type="text"
          placeholder="이름을 입력하세요"
          value={formData.name}
          onChange={(e) => onInputChange("name", e.target.value)}
          className="h-12 rounded-2xl border-gray-200"
          required
        />
        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-500">이름 공개 여부</label>
          <Select
            value={formData.isNameVisible ? "public" : "private"}
            onValueChange={(value) =>
              onInputChange("isNameVisible", value === "public")
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
        <label className="text-sm font-medium text-gray-700">학번</label>
        <Input
          type="text"
          placeholder="학번을 입력하세요"
          value={formData.studentNumber}
          onChange={(e) => onInputChange("studentNumber", e.target.value)}
          className="h-12 rounded-2xl border-gray-200"
          required
        />
        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-500">학번 공개 여부</label>
          <Select
            value={formData.isStudentNumberVisible ? "public" : "private"}
            onValueChange={(value) =>
              onInputChange("isStudentNumberVisible", value === "public")
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
        <label className="text-sm font-medium text-gray-700">성별</label>
        <Select
          value={formData.gender}
          onValueChange={(value) =>
            onInputChange("gender", value as "MALE" | "FEMALE")
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
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">학교 이메일</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="email"
            placeholder="학교 이메일을 입력하세요"
            value={formData.universityEmail}
            onChange={(e) => onInputChange("universityEmail", e.target.value)}
            className="pl-10 h-12 rounded-2xl border-gray-200"
            required
          />
        </div>
      </div>
    </div>
  );
}
