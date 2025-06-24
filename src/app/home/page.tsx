"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search, User, Loader2, Trophy } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import {
  getRunningRankings,
  type RunningRank,
  type MyRecord,
} from "./api/getRunningRankings";
import { getAllUniversityName } from "@/app/api/common/getAllUniversityName";
import FilterSection from "./components/FilterSection";
import RankingList from "./components/RankingList";
import InitialMessage from "./components/InitialMessage";
import MyRankCard from "./components/MyRankCard";

export default function HomePage() {
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<
    "TEN_KM" | "HALF" | "FULL"
  >("TEN_KM");
  const [selectedGender, setSelectedGender] = useState<
    "MALE" | "FEMALE" | "ALL"
  >("ALL");
  const [selectedGraduationStatus, setSelectedGraduationStatus] = useState<
    "ENROLLED" | "GRADUATED" | "ALL"
  >("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [isLoadingRankings, setIsLoadingRankings] = useState(false);
  const [rankingsData, setRankingsData] = useState<RunningRank[]>([]);
  const [myRecordData, setMyRecordData] = useState<MyRecord | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isIntegratedRanking, setIsIntegratedRanking] = useState(false);
  const [universities, setUniversities] = useState<string[]>([]);
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(true);
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user) as Record<
    string,
    unknown
  > | null;
  const [openCard, setOpenCard] = useState<string | null>(null);

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
    return data.filter((runner) => runner.gender === selectedGender);
  };

  const fetchRankings = async () => {
    setIsLoadingRankings(true);
    setHasSearched(true);
    setIsFilterExpanded(false);
    try {
      const { rankings, myrecord } = await getRunningRankings(
        selectedEvent,
        selectedGender,
        searchQuery || undefined,
        accessToken ?? undefined,
        selectedGraduationStatus
      );

      const rankingsList = rankings || [];
      const filteredData = filterByGender(rankingsList);
      const rerankedData = filteredData.map((runner, index) => ({
        ...runner,
        rank: index + 1,
      }));
      setRankingsData(rerankedData);
      setMyRecordData(myrecord);
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
    setSearchQuery("");
    setSelectedEvent("HALF");
    setSelectedGender("ALL");
    setSelectedGraduationStatus("ALL");
    setIsIntegratedRanking(false);
    setRankingsData([]);
    setMyRecordData(null);
    setHasSearched(false);
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

  const formatPace = (seconds: number, type: "TEN_KM" | "HALF" | "FULL") => {
    let distance = 10;
    if (type === "HALF") distance = 21.0975;
    if (type === "FULL") distance = 42.195;
    const pace = seconds / distance;
    const paceMin = Math.floor(pace / 60);
    const paceSec = Math.round(pace % 60);
    return `${paceMin}'${paceSec.toString().padStart(2, "0")}"/km`;
  };

  return (
    <div className="min-h-screen bg-white text-black max-w-md mx-auto">
      {/* Search Filter Section */}
      <div className="p-4">
        <FilterSection
          isFilterExpanded={isFilterExpanded}
          setIsFilterExpanded={setIsFilterExpanded}
          selectedSchool={selectedSchool}
          setSelectedSchool={setSelectedSchool}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
          selectedGender={selectedGender}
          setSelectedGender={setSelectedGender}
          selectedGraduationStatus={selectedGraduationStatus}
          setSelectedGraduationStatus={setSelectedGraduationStatus}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isIntegratedRanking={isIntegratedRanking}
          setIsIntegratedRanking={setIsIntegratedRanking}
          isLoadingRankings={isLoadingRankings}
          fetchRankings={fetchRankings}
          handleResetFilter={handleResetFilter}
          universities={universities}
          isLoadingUniversities={isLoadingUniversities}
          accessToken={accessToken}
          user={user}
        />
      </div>

      {/* Rankings Section */}
      {hasSearched ? (
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
                  : `${selectedSchool || searchQuery} 랭킹`}
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
                    {selectedSchool || searchQuery}
                  </span>
                )}
                <span>•</span>
                <span className="font-medium text-black">{selectedEvent}</span>
                <span>•</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                  {getGenderLabel(selectedGender)}
                </span>
                {selectedGraduationStatus !== "ALL" && (
                  <>
                    <span>•</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      {selectedGraduationStatus === "ENROLLED"
                        ? "재학생"
                        : "졸업생"}
                    </span>
                  </>
                )}
              </div>
            </div>

            {isLoadingRankings ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">랭킹을 불러오는 중...</p>
              </div>
            ) : rankingsData.length > 0 ? (
              <>
                <MyRankCard
                  myInfo={myRecordData ?? undefined}
                  formatTime={formatTime}
                  formatPace={formatPace}
                />
                <p className="text-sm text-gray-600 mb-6">
                  {isIntegratedRanking
                    ? `전국 상위 100명의 랭킹을 확인할 수 있습니다`
                    : `${
                        selectedSchool || searchQuery
                      } 내 100명의 랭킹을 확인할 수 있습니다`}
                </p>
                <RankingList
                  rankingsData={rankingsData}
                  openCard={openCard}
                  setOpenCard={setOpenCard}
                  isIntegratedRanking={isIntegratedRanking}
                  formatTime={formatTime}
                  formatPace={formatPace}
                />
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
      ) : (
        <InitialMessage setIsFilterExpanded={setIsFilterExpanded} />
      )}
    </div>
  );
}
