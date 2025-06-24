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
import { SignupForm } from "../api/reqSignup";

interface SchoolInfoFieldsProps {
  selectedUniversity: string;
  setSelectedUniversity: (value: string) => void;
  setValue: UseFormSetValue<SignupForm & { passwordConfirm: string }>;
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
  isMajorVisible: boolean;
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
  isMajorVisible,
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
        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-500">학과 공개 여부</label>
          <Select
            value={isMajorVisible ? "public" : "private"}
            onValueChange={(value) =>
              setValue("isMajorVisible", value === "public")
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
        <label className="text-sm font-medium text-gray-700">재학 상태</label>
        <Select
          required
          onValueChange={(value) =>
            setValue(
              "graduationStatus",
              value === "current" ? "ENROLLED" : "GRADUATED"
            )
          }
        >
          <SelectTrigger className="h-12 rounded-2xl border-gray-200 bg-white w-full">
            <SelectValue placeholder="재학 상태를 선택하세요" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl">
            <SelectItem value="current" className="rounded-xl">
              재학생
            </SelectItem>
            <SelectItem value="graduate" className="rounded-xl">
              졸업생
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="text-center mt-4">
        <p className="text-sm text-gray-500 mb-2">
          대학 정보가 없다면 아래로 연락주세요 !
        </p>
        <a
          href="https://open.kakao.com/o/suC2y2Ch"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-yellow-200 text-black rounded-lg font-semibold hover:bg-yellow-500 transition"
        >
          오픈카톡 문의하기
        </a>
      </div>
    </div>
  );
};

export default SchoolInfoFields;
