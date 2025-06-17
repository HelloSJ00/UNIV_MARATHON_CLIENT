"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Lock, Calendar, Upload, GraduationCap } from "lucide-react";
import Link from "next/link";
import SignupHeader from "./components/SignupHeader";

export default function SignupPage() {
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [departments, setDepartments] = useState<string[]>([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [schoolSearchQuery, setSchoolSearchQuery] = useState("");
  const [departmentSearchQuery, setDepartmentSearchQuery] = useState("");

  // Mock 학교 데이터
  const schools = [
    "성균관대학교",
    "한양대학교",
    "연세대학교",
    "고려대학교",
    "서울대학교",
    "중앙대학교",
    "경희대학교",
    "이화여자대학교",
  ];

  // Mock 학과 데이터 (학교별)
  const mockDepartments: { [key: string]: string[] } = {
    성균관대학교: [
      "컴퓨터공학과",
      "전자전기공학부",
      "경영학과",
      "경제학과",
      "화학공학과",
    ],
    한양대학교: [
      "컴퓨터소프트웨어학부",
      "기계공학부",
      "건축학부",
      "경영학부",
      "국어국문학과",
    ],
    연세대학교: [
      "컴퓨터과학과",
      "전기전자공학부",
      "경영학과",
      "심리학과",
      "생명공학과",
    ],
    고려대학교: [
      "컴퓨터학과",
      "전기전자공학부",
      "경영대학",
      "법학과",
      "의과대학",
    ],
    서울대학교: [
      "컴퓨터공학부",
      "전기정보공학부",
      "경영학과",
      "의과대학",
      "공과대학",
    ],
    중앙대학교: [
      "소프트웨어학부",
      "전자전기공학부",
      "경영경제대학",
      "예술대학",
      "사회과학대학",
    ],
    경희대학교: [
      "컴퓨터공학과",
      "전자공학과",
      "경영학과",
      "국제학부",
      "의과대학",
    ],
    이화여자대학교: [
      "컴퓨터공학과",
      "전자전기공학과",
      "경영학부",
      "국제학부",
      "의과대학",
    ],
  };

  // 학교 선택시 학과 로드
  useEffect(() => {
    if (selectedSchool) {
      setIsLoadingDepartments(true);
      setSelectedDepartment("");
      setDepartmentSearchQuery(""); // 학과 검색어 초기화

      // 서버 요청 시뮬레이션 (실제로는 API 호출)
      setTimeout(() => {
        setDepartments(mockDepartments[selectedSchool] || []);
        setIsLoadingDepartments(false);
      }, 500);
    } else {
      setDepartments([]);
      setSelectedDepartment("");
      setDepartmentSearchQuery(""); // 학과 검색어 초기화
    }
  }, [selectedSchool]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 회원가입 로직 구현
    console.log("회원가입 데이터 제출");
  };

  const filteredSchools = schools.filter((school) =>
    school.toLowerCase().includes(schoolSearchQuery.toLowerCase())
  );

  const filteredDepartments = departments.filter((department) =>
    department.toLowerCase().includes(departmentSearchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-black max-w-md mx-auto">
      {/* Header */}
      <SignupHeader />

      {/* Main Content */}
      <div className="p-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">계정 만들기</h2>
          <p className="text-gray-600">마라톤 기록 관리를 시작해보세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 프로필 이미지 */}
          <div className="flex flex-col items-center space-y-3">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage || "/placeholder.svg"}
                    alt="프로필"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-black rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors">
                <Upload className="w-4 h-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm text-gray-600">프로필 사진 업로드</p>
          </div>

          {/* 기본 정보 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                아이디
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="아이디를 입력하세요"
                  className="pl-10 h-12 rounded-2xl border-gray-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  className="pl-10 h-12 rounded-2xl border-gray-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">이름</label>
              <Input
                type="text"
                placeholder="이름을 입력하세요"
                className="h-12 rounded-2xl border-gray-200"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                생년월일
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="date"
                  className="pl-10 h-12 rounded-2xl border-gray-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">성별</label>
              <Select required>
                <SelectTrigger className="h-12 rounded-2xl border-gray-200 w-full">
                  <SelectValue placeholder="성별을 선택하세요" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="male" className="rounded-xl">
                    남성
                  </SelectItem>
                  <SelectItem value="female" className="rounded-xl">
                    여성
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">학번</label>
              <Select required>
                <SelectTrigger className="h-12 rounded-2xl border-gray-200 w-full">
                  <SelectValue placeholder="입학년도를 선택하세요" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {Array.from({ length: 10 }, (_, i) => 2024 - i).map(
                    (year) => (
                      <SelectItem
                        key={year}
                        value={year.toString()}
                        className="rounded-xl"
                      >
                        {year}학번
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 학교 정보 */}
          <div className="bg-gray-50 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-lg font-medium">
              <GraduationCap className="w-5 h-5" />
              학교 정보
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">학교</label>
              <Select
                value={selectedSchool}
                onValueChange={setSelectedSchool}
                required
              >
                <SelectTrigger className="h-12 rounded-2xl border-gray-200 bg-white w-full">
                  <SelectValue placeholder="학교를 선택하세요" />
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
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">학과</label>
              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
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
                  />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {!isLoadingDepartments && departments.length > 0 && (
                    <div className="p-2">
                      <Input
                        placeholder="학과명 검색..."
                        value={departmentSearchQuery}
                        onChange={(e) =>
                          setDepartmentSearchQuery(e.target.value)
                        }
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
          </div>

          {/* 회원가입 버튼 */}
          <Button
            type="submit"
            className="w-full h-14 bg-black text-white hover:bg-gray-800 rounded-2xl text-lg font-medium"
          >
            회원가입 완료
          </Button>

          {/* 로그인 링크 */}
          <div className="text-center">
            <p className="text-gray-600">
              이미 계정이 있으신가요?
              <Link
                href="/login"
                className="text-black font-medium hover:underline ml-1"
              >
                로그인
              </Link>
            </p>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="p-4 text-center">
        <p className="text-xs text-gray-500">
          회원가입을 통해 마라톤 기록을 관리하세요
        </p>
      </div>
    </div>
  );
}
