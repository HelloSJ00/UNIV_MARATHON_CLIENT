"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import SegmentedControl from "./SegmentedControl";
import type { User } from "@/store/auth";

interface FilterSectionProps {
  isFilterExpanded: boolean;
  setIsFilterExpanded: (v: boolean) => void;
  selectedSchool: string;
  setSelectedSchool: (v: string) => void;
  selectedEvent: "TEN_KM" | "HALF" | "FULL";
  setSelectedEvent: (v: "TEN_KM" | "HALF" | "FULL") => void;
  selectedGender: "MALE" | "FEMALE" | "ALL";
  setSelectedGender: (v: "MALE" | "FEMALE" | "ALL") => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  isIntegratedRanking: boolean;
  setIsIntegratedRanking: (v: boolean) => void;
  isLoadingRankings: boolean;
  fetchRankings: () => void;
  handleResetFilter: () => void;
  universities: string[];
  isLoadingUniversities: boolean;
  accessToken: string | null;
  user: User | null;
  selectedGraduationStatus: "ENROLLED" | "GRADUATED" | "ALL";
  setSelectedGraduationStatus: (v: "ENROLLED" | "GRADUATED" | "ALL") => void;
}

const eventOptions = [
  { value: "TEN_KM", label: "10km" },
  { value: "HALF", label: "하프" },
  { value: "FULL", label: "풀" },
];

const genderOptions = [
  { value: "ALL", label: "전체" },
  { value: "MALE", label: "남성" },
  { value: "FEMALE", label: "여성" },
];

const graduationOptions = [
  { value: "ALL", label: "전체" },
  { value: "ENROLLED", label: "재학생" },
  { value: "GRADUATED", label: "졸업생" },
];

export default function FilterSection({
  isFilterExpanded,
  setIsFilterExpanded,
  selectedSchool,
  setSelectedSchool,
  selectedEvent,
  setSelectedEvent,
  selectedGender,
  setSelectedGender,
  searchQuery,
  setSearchQuery,
  isIntegratedRanking,
  setIsIntegratedRanking,
  isLoadingRankings,
  fetchRankings,
  handleResetFilter,
  universities,
  isLoadingUniversities,
  accessToken,
  user,
  selectedGraduationStatus,
  setSelectedGraduationStatus,
}: FilterSectionProps) {
  const filteredSchools = universities.filter((school) =>
    school.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 통합 랭킹 체크박스 변경
  const handleIntegratedRankingChange = (checked: boolean) => {
    setIsIntegratedRanking(checked);
    if (checked) {
      setSelectedSchool("");
      setSearchQuery("");
    }
  };

  const getEventLabel = (event: string) => {
    const option = eventOptions.find((opt) => opt.value === event);
    return option?.label || event;
  };

  const getGenderLabel = (gender: string) => {
    const option = genderOptions.find((opt) => opt.value === gender);
    return option?.label || gender;
  };

  const getGraduationLabel = (status: string) => {
    const option = graduationOptions.find((opt) => opt.value === status);
    return option?.label || status;
  };

  return (
    <div className="bg-gray-50 rounded-3xl overflow-hidden border border-gray-200 shadow-sm transition-all">
      {/* Filter Header */}
      <div
        className={`flex items-center justify-between cursor-pointer select-none transition-all ${
          isFilterExpanded ? "mb-4 p-6" : "p-4"
        }`}
        onClick={() => setIsFilterExpanded(!isFilterExpanded)}
      >
        <div className="flex items-center gap-2 text-lg font-medium">
          <Search className="w-5 h-5" />
          <span>검색 필터</span>
          {!isFilterExpanded &&
            (selectedSchool || selectedEvent || isIntegratedRanking) && (
              <div className="flex gap-2 ml-2">
                {isIntegratedRanking && (
                  <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                    통합랭킹
                  </span>
                )}
                {!isIntegratedRanking && selectedSchool && (
                  <span className="px-2 py-1 bg-black text-white text-xs rounded-full">
                    {selectedSchool}
                  </span>
                )}
                {selectedEvent && (
                  <span className="px-2 py-1 bg-black text-white text-xs rounded-full">
                    {getEventLabel(selectedEvent)}
                  </span>
                )}
                {selectedGender !== "ALL" && (
                  <span className="px-2 py-1 bg-black text-white text-xs rounded-full">
                    {getGenderLabel(selectedGender)}
                  </span>
                )}
                {selectedGraduationStatus !== "ALL" && (
                  <span className="px-2 py-1 bg-black text-white text-xs rounded-full">
                    {getGraduationLabel(selectedGraduationStatus)}
                  </span>
                )}
              </div>
            )}
        </div>
        {isFilterExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </div>

      {/* Filter Content */}
      {isFilterExpanded && (
        <div className="px-6 pb-6 space-y-6">
          {/* School Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              학교 선택
            </label>
            <Select
              value={selectedSchool}
              onValueChange={(school) => {
                setSelectedSchool(school);
                setSearchQuery(school);
              }}
              disabled={isIntegratedRanking || !accessToken || !user}
            >
              <SelectTrigger
                className={`w-full h-12 rounded-2xl border-gray-200 bg-white ${
                  isIntegratedRanking || !accessToken
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <SelectValue
                  placeholder={
                    !accessToken || !user
                      ? "로그인 시 학교별 랭킹 확인 가능"
                      : isIntegratedRanking
                      ? "통합 랭킹에서는 학교 선택 불필요"
                      : "학교를 선택하세요"
                  }
                />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <div className="p-2">
                  <Input
                    placeholder="학교명 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mb-2 rounded-xl border-gray-200"
                  />
                </div>
                {isLoadingUniversities ? (
                  <div className="p-2 text-sm text-gray-500 text-center">
                    학교 목록을 불러오는 중...
                  </div>
                ) : filteredSchools.length > 0 ? (
                  <div className="max-h-48 overflow-y-auto">
                    {filteredSchools.map((school) => (
                      <SelectItem
                        key={school}
                        value={school}
                        className="rounded-xl"
                      >
                        {school}
                      </SelectItem>
                    ))}
                  </div>
                ) : (
                  <div className="p-2 text-sm text-gray-500 text-center">
                    검색 결과가 없습니다
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Integrated Ranking Button */}
          <div className="space-y-2">
            <button
              onClick={() =>
                handleIntegratedRankingChange(!isIntegratedRanking)
              }
              className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 ${
                isIntegratedRanking
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="font-medium">통합 랭킹으로 보기</div>
                  <p className="text-sm mt-1 opacity-90">
                    {!accessToken || !user
                      ? "로그인하지 않은 사용자는 통합 랭킹만 확인할 수 있습니다"
                      : "전국 모든 대학생 중에서의 순위를 확인합니다"}
                  </p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isIntegratedRanking
                      ? "border-white bg-white"
                      : "border-blue-400 bg-transparent"
                  }`}
                >
                  {isIntegratedRanking && (
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  )}
                </div>
              </div>
            </button>
            {/* 우리학교만 보기 버튼: 로그인+user 있을 때만 노출 */}
            {accessToken && user && typeof user.universityName === "string" && (
              <button
                onClick={() => {
                  setIsIntegratedRanking(false);
                  setSelectedSchool(user.universityName);
                  setSearchQuery(user.universityName);
                }}
                className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 mt-2 ${
                  !isIntegratedRanking && selectedSchool === user.universityName
                    ? "bg-green-500 border-green-500 text-white"
                    : "bg-green-50 border-green-200 text-green-800 hover:bg-green-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="font-medium">우리학교만 보기</div>
                    <p className="text-sm mt-1 opacity-90">
                      {user.universityName} 학생들의 랭킹을 확인합니다
                    </p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      !isIntegratedRanking &&
                      selectedSchool === user.universityName
                        ? "border-white bg-white"
                        : "border-green-400 bg-transparent"
                    }`}
                  >
                    {!isIntegratedRanking &&
                      selectedSchool === user.universityName && (
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      )}
                  </div>
                </div>
              </button>
            )}
          </div>

          {/* Event Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              종목 선택
            </label>
            <SegmentedControl
              options={eventOptions}
              value={selectedEvent}
              onChange={(value) =>
                setSelectedEvent(value as "TEN_KM" | "HALF" | "FULL")
              }
            />
          </div>

          {/* Gender Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              성별 선택
            </label>
            <SegmentedControl
              options={genderOptions}
              value={selectedGender}
              onChange={(value) =>
                setSelectedGender(value as "MALE" | "FEMALE" | "ALL")
              }
            />
          </div>

          {/* Graduation Status Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              재학생/졸업생 구분
            </label>
            <SegmentedControl
              options={graduationOptions}
              value={selectedGraduationStatus}
              onChange={(value) =>
                setSelectedGraduationStatus(
                  value as "ENROLLED" | "GRADUATED" | "ALL"
                )
              }
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={fetchRankings}
              disabled={
                (!isIntegratedRanking && !selectedSchool) ||
                !selectedEvent ||
                isLoadingRankings
              }
              className="flex-1 h-12 bg-black text-white hover:bg-gray-800 rounded-2xl font-medium disabled:bg-gray-200 disabled:text-gray-500"
            >
              {isLoadingRankings ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  검색 중...
                </>
              ) : (
                "순위 확인하기"
              )}
            </Button>
            <Button
              onClick={handleResetFilter}
              variant="outline"
              className="px-4 h-12 border-gray-200 hover:bg-gray-50 rounded-2xl bg-transparent"
            >
              초기화
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
