import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { User } from "@/store/auth";

interface SchoolInfoFieldsProps {
  isEditingSchool: boolean;
  setIsEditingSchool: (v: boolean) => void;
  selectedSchool: string;
  setSelectedSchool: (v: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (v: string) => void;
  universities: string[];
  departments: string[];
  isLoadingUniversities: boolean;
  isLoadingDepartments: boolean;
  schoolSearchQuery: string;
  setSchoolSearchQuery: (v: string) => void;
  departmentSearchQuery: string;
  setDepartmentSearchQuery: (v: string) => void;
  handleSchoolChange: (school: string) => void;
  handleDepartmentChange: (department: string) => void;
  user: User;
  formData: {
    isMajorVisible: boolean;
  };
  onInputChange: (field: string, value: boolean) => void;
}

export default function SchoolInfoFields({
  isEditingSchool,
  setIsEditingSchool,
  selectedSchool,
  setSelectedSchool,
  selectedDepartment,
  setSelectedDepartment,
  universities,
  departments,
  isLoadingUniversities,
  isLoadingDepartments,
  schoolSearchQuery,
  setSchoolSearchQuery,
  departmentSearchQuery,
  setDepartmentSearchQuery,
  handleSchoolChange,
  handleDepartmentChange,
  user,
  formData,
  onInputChange,
}: SchoolInfoFieldsProps) {
  const filteredSchools = universities.filter((school) =>
    school.toLowerCase().includes(schoolSearchQuery.toLowerCase())
  );
  const filteredDepartments = departments.filter((department) =>
    department.toLowerCase().includes(departmentSearchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-50 rounded-3xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-lg font-medium">
          <GraduationCap className="w-5 h-5" />
          학교 정보
        </div>
        {!isEditingSchool ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsEditingSchool(true)}
            className="text-sm"
          >
            수정하기
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setIsEditingSchool(false);
              setSelectedSchool(user?.universityName || "");
              setSelectedDepartment(user?.majorName || "");
            }}
            className="text-sm"
          >
            취소
          </Button>
        )}
      </div>
      <div className="flex items-center justify-between">
        <label className="text-xs text-gray-500">학과 공개 여부</label>
        <Select
          value={formData.isMajorVisible ? "public" : "private"}
          onValueChange={(value) =>
            onInputChange("isMajorVisible", value === "public")
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
      {!isEditingSchool ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">학교:</span>
            <span className="text-sm text-gray-600">
              {user?.universityName}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">학과:</span>
            <span className="text-sm text-gray-600">{user?.majorName}</span>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">학교</label>
            <Select
              value={selectedSchool}
              onValueChange={handleSchoolChange}
              required
            >
              <SelectTrigger className="h-12 rounded-2xl border-gray-200 bg-white w-full">
                <SelectValue placeholder="학교를 선택하세요">
                  {selectedSchool}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <div className="p-2">
                  <Input
                    placeholder="학교명 검색..."
                    value={schoolSearchQuery}
                    onChange={(e) => setSchoolSearchQuery(e.target.value)}
                    className="mb-2 rounded-xl border-gray-200"
                  />
                </div>
                {isLoadingUniversities ? (
                  <div className="p-2 text-sm text-gray-500 text-center">
                    학교 목록을 불러오는 중...
                  </div>
                ) : (
                  <>
                    {filteredSchools.map((school) => (
                      <SelectItem
                        key={school}
                        value={school}
                        className="rounded-xl"
                      >
                        {school}
                      </SelectItem>
                    ))}
                    {filteredSchools.length === 0 && (
                      <div className="p-2 text-sm text-gray-500 text-center">
                        검색 결과가 없습니다
                      </div>
                    )}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">학과</label>
            <Select
              value={selectedDepartment}
              onValueChange={handleDepartmentChange}
              disabled={!selectedSchool || isLoadingDepartments}
              required
            >
              <SelectTrigger className="h-12 rounded-2xl border-gray-200 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed w-full">
                <SelectValue
                  placeholder={
                    !selectedSchool
                      ? "먼저 학교를 선택하세요"
                      : isLoadingDepartments
                      ? "학과 정보를 불러오는 중..."
                      : "학과를 선택하세요"
                  }
                >
                  {selectedDepartment}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {!isLoadingDepartments && departments.length > 0 && (
                  <div className="p-2">
                    <Input
                      placeholder="학과명 검색..."
                      value={departmentSearchQuery}
                      onChange={(e) => setDepartmentSearchQuery(e.target.value)}
                      className="mb-2 rounded-xl border-gray-200"
                    />
                  </div>
                )}
                {filteredDepartments.map((department) => (
                  <SelectItem
                    key={department}
                    value={department}
                    className="rounded-xl"
                  >
                    {department}
                  </SelectItem>
                ))}
                {!isLoadingDepartments &&
                  filteredDepartments.length === 0 &&
                  departments.length > 0 && (
                    <div className="p-2 text-sm text-gray-500 text-center">
                      검색 결과가 없습니다
                    </div>
                  )}
              </SelectContent>
            </Select>
          </div>
          <div className="bg-yellow-50 rounded-2xl p-4 mt-4">
            <h4 className="font-medium text-yellow-800 mb-2">⚠️ 주의사항</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>
                • 학교 정보를 수정하면 기록 인증 및 학교 인증을 다시 진행해야
                합니다
              </li>
              <li>• 학교 이메일 인증이 필요할 수 있습니다</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
