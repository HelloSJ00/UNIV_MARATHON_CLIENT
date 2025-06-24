import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import React from "react";

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
  user: Record<string, unknown> | null;
  selectedGraduationStatus: "ENROLLED" | "GRADUATED" | "ALL";
  setSelectedGraduationStatus: (v: "ENROLLED" | "GRADUATED" | "ALL") => void;
}

const events = ["TEN_KM", "HALF", "FULL"];
const genders = [
  { value: "ALL", label: "전체" },
  { value: "MALE", label: "남성" },
  { value: "FEMALE", label: "여성" },
];

const graduationStatuses = [
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

  return (
    <div className="bg-gray-50 rounded-3xl overflow-hidden">
      {/* Filter Header */}
      <div
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-100 transition-colors"
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
                    {selectedEvent}
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
          {/* Integrated Ranking Checkbox */}
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-2xl border border-blue-200">
            <Checkbox
              id="integrated-ranking"
              checked={isIntegratedRanking}
              onCheckedChange={handleIntegratedRankingChange}
              className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
            />
            <div className="flex-1">
              <label
                htmlFor="integrated-ranking"
                className="text-sm font-medium text-blue-800 cursor-pointer"
              >
                통합 랭킹으로 보기
              </label>
              <p className="text-xs text-blue-600 mt-1">
                {!accessToken || !user
                  ? "로그인하지 않은 사용자는 통합 랭킹만 확인할 수 있습니다"
                  : "전국 모든 대학생 중에서의 순위를 확인합니다"}
              </p>
            </div>
          </div>
          {/* Event Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              종목 선택
            </label>
            <Select
              value={selectedEvent}
              onValueChange={(value) =>
                setSelectedEvent(value as "TEN_KM" | "HALF" | "FULL")
              }
            >
              <SelectTrigger className="w-full h-12 rounded-2xl border-gray-200 bg-white">
                <SelectValue placeholder="종목을 선택하세요" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {events.map((event) => (
                  <SelectItem key={event} value={event} className="rounded-xl">
                    {event}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Gender Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              성별 선택
            </label>
            <Select
              value={selectedGender}
              onValueChange={(value) =>
                setSelectedGender(value as "MALE" | "FEMALE" | "ALL")
              }
            >
              <SelectTrigger className="w-full h-12 rounded-2xl border-gray-200 bg-white">
                <SelectValue placeholder="성별을 선택하세요" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {genders.map((gender) => (
                  <SelectItem
                    key={gender.value}
                    value={gender.value}
                    className="rounded-xl"
                  >
                    {gender.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Graduation Status Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              재학생/졸업생 구분
            </label>
            <Select
              value={selectedGraduationStatus}
              onValueChange={(value) =>
                setSelectedGraduationStatus(
                  value as "ENROLLED" | "GRADUATED" | "ALL"
                )
              }
            >
              <SelectTrigger className="w-full h-12 rounded-2xl border-gray-200 bg-white">
                <SelectValue placeholder="재학 상태를 선택하세요" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {graduationStatuses.map((status) => (
                  <SelectItem
                    key={status.value}
                    value={status.value}
                    className="rounded-xl"
                  >
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              className="px-4 h-12 border-gray-200 hover:bg-gray-50 rounded-2xl"
            >
              초기화
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
