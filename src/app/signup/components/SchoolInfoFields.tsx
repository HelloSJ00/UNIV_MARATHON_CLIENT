import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraduationCap } from "lucide-react";
import React from "react";
import { UseFormSetValue } from "react-hook-form";

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

interface SchoolInfoFieldsProps {
  selectedUniversity: string;
  setSelectedUniversity: (value: string) => void;
  setValue: UseFormSetValue<SignupFormData & { passwordConfirm: string }>;
  isLoadingUniversities: boolean;
  universities: string[];
  universitySearchQuery: string;
  setUniversitySearchQuery: (value: string) => void;
  errors: Record<string, { message?: string }>;
  selectedMajor: string;
  setSelectedMajor: (value: string) => void;
  isLoadingMajors: boolean;
  majors: string[];
  majorSearchQuery: string;
  setMajorSearchQuery: (value: string) => void;
}

const SchoolInfoFields = ({
  selectedUniversity,
  setSelectedUniversity,
  setValue,
  isLoadingUniversities,
  universities,
  universitySearchQuery,
  setUniversitySearchQuery,
  errors,
  selectedMajor,
  setSelectedMajor,
  isLoadingMajors,
  majors,
  majorSearchQuery,
  setMajorSearchQuery,
}: SchoolInfoFieldsProps) => {
  const filteredUniversities = universities.filter((university) =>
    university.toLowerCase().includes(universitySearchQuery.toLowerCase())
  );
  const filteredMajors = majors.filter((major) =>
    major.toLowerCase().includes(majorSearchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-50 rounded-3xl p-6 space-y-4">
      <div className="flex items-center gap-2 text-lg font-medium">
        <GraduationCap className="w-5 h-5" />
        학교 정보
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">대학교</label>
        <Select
          value={selectedUniversity}
          onValueChange={(value) => {
            setSelectedUniversity(value);
            setValue("university", value);
          }}
          required
          disabled={isLoadingUniversities}
        >
          <SelectTrigger className="h-12 rounded-2xl border-gray-200 bg-white w-full">
            <SelectValue
              placeholder={
                isLoadingUniversities
                  ? "대학교 목록을 불러오는 중..."
                  : "대학교를 선택하세요"
              }
            />
          </SelectTrigger>
          <SelectContent className="rounded-2xl">
            <div className="p-2">
              <Input
                placeholder="대학교명 검색..."
                value={universitySearchQuery}
                onChange={(e) => setUniversitySearchQuery(e.target.value)}
                className="mb-2 rounded-xl border-gray-200"
              />
            </div>
            {filteredUniversities.map((university) => (
              <SelectItem
                key={university}
                value={university}
                className="rounded-xl"
              >
                {university}
              </SelectItem>
            ))}
            {filteredUniversities.length === 0 && (
              <div className="p-2 text-sm text-gray-500 text-center">
                검색 결과가 없습니다
              </div>
            )}
          </SelectContent>
        </Select>
        {errors.university && (
          <p className="text-red-500 text-sm mt-1">
            {errors.university.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">학과</label>
        <Select
          value={selectedMajor}
          onValueChange={(value) => {
            setSelectedMajor(value);
            setValue("major", value);
          }}
          disabled={!selectedUniversity || isLoadingMajors}
          required
        >
          <SelectTrigger className="h-12 rounded-2xl border-gray-200 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed w-full">
            <SelectValue
              placeholder={
                !selectedUniversity
                  ? "먼저 대학교를 선택하세요"
                  : isLoadingMajors
                  ? "학과 정보를 불러오는 중..."
                  : "학과를 선택하세요"
              }
            />
          </SelectTrigger>
          <SelectContent className="rounded-2xl">
            {!isLoadingMajors && majors.length > 0 && (
              <div className="p-2">
                <Input
                  placeholder="학과명 검색..."
                  value={majorSearchQuery}
                  onChange={(e) => setMajorSearchQuery(e.target.value)}
                  className="mb-2 rounded-xl border-gray-200"
                />
              </div>
            )}
            {filteredMajors.map((major) => (
              <SelectItem key={major} value={major} className="rounded-xl">
                {major}
              </SelectItem>
            ))}
            {!isLoadingMajors &&
              filteredMajors.length === 0 &&
              majors.length > 0 && (
                <div className="p-2 text-sm text-gray-500 text-center">
                  검색 결과가 없습니다
                </div>
              )}
          </SelectContent>
        </Select>
        {errors.major && (
          <p className="text-red-500 text-sm mt-1">{errors.major.message}</p>
        )}
      </div>
    </div>
  );
};

export default SchoolInfoFields;
