"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Clock,
  User,
  ChevronDown,
  ChevronUp,
  Loader2,
  Trophy,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { getRunningRankings, type RunningRank } from "@/app/api/records";
import { getAllUniversityName } from "@/app/api/getAllUniversityName";

export default function HomePage() {
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<
    "TEN_KM" | "HALF" | "FULL"
  >("TEN_KM");
  const [selectedGender, setSelectedGender] = useState<
    "MALE" | "FEMALE" | "ALL"
  >("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [isLoadingRankings, setIsLoadingRankings] = useState(false);
  const [rankingsData, setRankingsData] = useState<RunningRank[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isIntegratedRanking, setIsIntegratedRanking] = useState(false);
  const [universities, setUniversities] = useState<string[]>([]);
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(true);
  const accessToken = useAuthStore((state) => state.accessToken);

  // 대학교 목록 가져오기
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await getAllUniversityName();
        setUniversities(response.data);
      } catch (error) {
        console.error("대학교 목록 조회 실패:", error);
      } finally {
        setIsLoadingUniversities(false);
      }
    };

    fetchUniversities();
  }, []);

  const events = ["TEN_KM", "HALF", "FULL"];
  const genders = [
    { value: "ALL", label: "전체" },
    { value: "MALE", label: "남성" },
    { value: "FEMALE", label: "여성" },
  ];

  // 성별에 따른 데이터 필터링
  const filterByGender = (data: RunningRank[]) => {
    if (!selectedGender || selectedGender === "ALL") {
      return data;
    }
    return data.filter((runner) => runner.user.gender === selectedGender);
  };

  const filteredSchools = universities.filter((school) =>
    school.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchRankings = async () => {
    setIsLoadingRankings(true);
    setHasSearched(true);

    try {
      console.log("랭킹 조회 파라미터:", {
        runningType: selectedEvent,
        universityName: searchQuery || undefined,
        gender: selectedGender,
      });

      const response = await getRunningRankings(
        selectedEvent,
        searchQuery || undefined,
        selectedGender
      );
      const filteredData = filterByGender(response.data);
      const rerankedData = filteredData.map((runner, index) => ({
        ...runner,
        rank: index + 1,
      }));
      setRankingsData(rerankedData);
    } catch (error) {
      console.error("랭킹 조회 실패:", error);
      alert("랭킹 조회에 실패했습니다.");
    } finally {
      setIsLoadingRankings(false);
    }
  };

  // 필터 초기화
  const handleResetFilter = () => {
    setSelectedSchool("");
    setSearchQuery(""); // 검색어도 초기화
    setSelectedEvent("HALF");
    setSelectedGender("ALL");
    setIsIntegratedRanking(false);
    setRankingsData([]);
    setHasSearched(false);
  };

  // 통합 랭킹 체크박스 변경
  const handleIntegratedRankingChange = (checked: boolean) => {
    setIsIntegratedRanking(checked);
    if (checked) {
      setSelectedSchool(""); // 통합 랭킹 선택시 학교 선택 초기화
      setSearchQuery(""); // 검색어도 초기화
    }
  };

  // 성별 라벨 가져오기
  const getGenderLabel = (value: string) => {
    const gender = genders.find((g) => g.value === value);
    return gender ? gender.label : value;
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-white text-black max-w-md mx-auto">
      {/* Search Filter Section */}
      <div className="p-4">
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
                  disabled={isIntegratedRanking || !accessToken}
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
                        !accessToken
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
                    {!accessToken
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
                      <SelectItem
                        key={event}
                        value={event}
                        className="rounded-xl"
                      >
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
      </div>

      {/* Rankings Section */}
      {hasSearched && (
        <div className="px-4 pb-6">
          <div className="bg-gray-50 rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-4">
              {isIntegratedRanking ? (
                <Trophy className="w-5 h-5 text-blue-500" />
              ) : (
                <User className="w-5 h-5" />
              )}
              <h2 className="text-lg font-bold">
                {isIntegratedRanking
                  ? "전국 통합 랭킹"
                  : `${selectedSchool} 랭킹`}
              </h2>
            </div>

            {/* 검색 조건 표시 */}
            <div className="mb-4 p-3 bg-white rounded-2xl border border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
                <span>검색 조건:</span>
                {isIntegratedRanking ? (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    전국 통합
                  </span>
                ) : (
                  <span className="font-medium text-black">
                    {selectedSchool}
                  </span>
                )}
                <span>•</span>
                <span className="font-medium text-black">{selectedEvent}</span>
                <span>•</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                  {getGenderLabel(selectedGender)}
                </span>
              </div>
            </div>

            {isLoadingRankings ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">랭킹을 불러오는 중...</p>
              </div>
            ) : rankingsData.length > 0 ? (
              <>
                <p className="text-sm text-gray-600 mb-6">
                  {isIntegratedRanking
                    ? `전국 ${rankingsData.length}명의 랭킹을 확인할 수 있습니다`
                    : `${selectedSchool} 내 ${rankingsData.length}명의 랭킹을 확인할 수 있습니다`}
                </p>

                <div className="space-y-3">
                  {rankingsData.map((runner) => (
                    <div
                      key={`${runner.user.id}-${runner.type}`}
                      className="bg-white rounded-2xl p-4 border border-gray-100"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                              isIntegratedRanking ? "bg-blue-500" : "bg-black"
                            }`}
                          >
                            {runner.rank}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {runner.user.name}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  runner.user.gender === "MALE"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-pink-100 text-pink-700"
                                }`}
                              >
                                {runner.user.gender === "MALE" ? "남" : "여"}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {runner.user.universityName}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm font-mono">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {formatTime(runner.recordTimeInSeconds)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Button
                    variant="ghost"
                    className="text-gray-600 hover:text-black rounded-full"
                  >
                    더 보기
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">검색 결과가 없습니다</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 초기 상태 메시지 */}
      {!hasSearched && (
        <div className="px-4 pb-6">
          <div className="bg-gray-50 rounded-3xl p-6 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold mb-2">마라톤 랭킹 검색</h3>
            <p className="text-gray-600 mb-4">
              학교별 랭킹 또는 전국 통합 랭킹을
              <br />
              확인해보세요
            </p>
            <div className="flex flex-col gap-2 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>학교별 랭킹: 특정 학교 내에서의 순위</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-blue-500" />
                <span>통합 랭킹: 전국 모든 대학생 중 순위</span>
              </div>
            </div>
            <Button
              onClick={() => setIsFilterExpanded(true)}
              variant="outline"
              className="border-gray-200 hover:bg-gray-100 rounded-2xl"
            >
              검색 시작하기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
