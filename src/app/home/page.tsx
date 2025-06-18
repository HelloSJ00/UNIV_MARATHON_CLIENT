"use client";

import { useState } from "react";
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

export default function HomePage() {
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedGender, setSelectedGender] = useState(""); // 성별 필터 추가
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [isLoadingRankings, setIsLoadingRankings] = useState(false);
  const [rankingsData, setRankingsData] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isIntegratedRanking, setIsIntegratedRanking] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);

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

  const events = ["TEN_KM", "HALF", "FULL"];
  const genders = [
    { value: "all", label: "전체" },
    { value: "male", label: "남성" },
    { value: "female", label: "여성" },
  ];

  // Mock 전체 랭킹 데이터 (통합 랭킹용) - 성별 정보 추가
  const mockIntegratedRankings = [
    {
      rank: 1,
      name: "이준호",
      school: "한양대학교",
      time: "2:45:23",
      gender: "male",
    },
    {
      rank: 2,
      name: "김민수",
      school: "성균관대학교",
      time: "2:47:15",
      gender: "male",
    },
    {
      rank: 3,
      name: "박서연",
      school: "연세대학교",
      time: "2:48:42",
      gender: "female",
    },
    {
      rank: 4,
      name: "정다은",
      school: "고려대학교",
      time: "2:49:18",
      gender: "female",
    },
    {
      rank: 5,
      name: "최동현",
      school: "한양대학교",
      time: "2:50:41",
      gender: "male",
    },
    {
      rank: 6,
      name: "강지우",
      school: "서울대학교",
      time: "2:52:07",
      gender: "male",
    },
    {
      rank: 7,
      name: "윤하늘",
      school: "중앙대학교",
      time: "2:53:29",
      gender: "female",
    },
    {
      rank: 8,
      name: "임소영",
      school: "경희대학교",
      time: "2:54:15",
      gender: "female",
    },
    {
      rank: 9,
      name: "조민준",
      school: "연세대학교",
      time: "2:55:30",
      gender: "male",
    },
    {
      rank: 10,
      name: "한예린",
      school: "이화여자대학교",
      time: "2:56:45",
      gender: "female",
    },
  ];

  // Mock 학교별 랭킹 데이터 - 성별 정보 추가
  const mockSchoolRankings = [
    {
      rank: 1,
      name: "김민수",
      school: "성균관대학교",
      time: "2:47:15",
      gender: "male",
    },
    {
      rank: 2,
      name: "이서준",
      school: "성균관대학교",
      time: "2:52:30",
      gender: "male",
    },
    {
      rank: 3,
      name: "박지민",
      school: "성균관대학교",
      time: "2:55:18",
      gender: "female",
    },
    {
      rank: 4,
      name: "최유진",
      school: "성균관대학교",
      time: "2:58:42",
      gender: "female",
    },
    {
      rank: 5,
      name: "정민호",
      school: "성균관대학교",
      time: "3:02:15",
      gender: "male",
    },
    {
      rank: 6,
      name: "김하은",
      school: "성균관대학교",
      time: "3:05:30",
      gender: "female",
    },
  ];

  // 성별에 따른 데이터 필터링
  const filterByGender = (data: any[]) => {
    if (!selectedGender || selectedGender === "all") {
      return data;
    }
    return data.filter((runner) => runner.gender === selectedGender);
  };

  const filteredSchools = schools.filter((school) =>
    school.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 순위 확인하기 버튼 클릭
  const handleSearchRankings = () => {
    // 통합 랭킹이 아닌 경우 학교 선택 필수
    if (!isIntegratedRanking && !selectedSchool) {
      alert("학교를 선택해주세요.");
      return;
    }

    if (!selectedEvent) {
      alert("종목을 선택해주세요.");
      return;
    }

    if (!selectedGender) {
      alert("성별을 선택해주세요.");
      return;
    }

    setIsLoadingRankings(true);
    setHasSearched(true);

    // 서버 요청 시뮬레이션
    setTimeout(() => {
      let rawData;
      if (isIntegratedRanking) {
        // 통합 랭킹: 전국 모든 대학생 랭킹
        rawData = mockIntegratedRankings;
      } else {
        // 학교별 랭킹: 선택한 학교 내 랭킹
        rawData = mockSchoolRankings;
      }

      // 성별 필터링 적용
      const filteredData = filterByGender(rawData);

      // 순위 재정렬 (필터링 후 순위 재계산)
      const rerankedData = filteredData.map((runner, index) => ({
        ...runner,
        rank: index + 1,
      }));

      setRankingsData(rerankedData);
      setIsLoadingRankings(false);
    }, 1500);
  };

  // 필터 초기화
  const handleResetFilter = () => {
    setSelectedSchool("");
    setSelectedEvent("");
    setSelectedGender("");
    setIsIntegratedRanking(false);
    setRankingsData([]);
    setHasSearched(false);
  };

  // 통합 랭킹 체크박스 변경
  const handleIntegratedRankingChange = (checked: boolean) => {
    setIsIntegratedRanking(checked);
    if (checked) {
      setSelectedSchool(""); // 통합 랭킹 선택시 학교 선택 초기화
    }
  };

  // 성별 라벨 가져오기
  const getGenderLabel = (value: string) => {
    const gender = genders.find((g) => g.value === value);
    return gender ? gender.label : value;
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
                  onValueChange={setSelectedSchool}
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
                    {filteredSchools.map((school) => (
                      <SelectItem
                        key={school}
                        value={school}
                        className="rounded-xl"
                      >
                        {school}
                      </SelectItem>
                    ))}
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
                <Select value={selectedEvent} onValueChange={setSelectedEvent}>
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
                  onValueChange={setSelectedGender}
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
                  onClick={handleSearchRankings}
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
                      key={`${runner.name}-${runner.rank}`}
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
                              <span className="font-medium">{runner.name}</span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  runner.gender === "male"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-pink-100 text-pink-700"
                                }`}
                              >
                                {runner.gender === "male" ? "남" : "여"}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {runner.school}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm font-mono">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {runner.time}
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
