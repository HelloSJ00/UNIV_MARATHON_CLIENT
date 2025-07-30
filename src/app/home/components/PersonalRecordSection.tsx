"use client";

import { Button } from "@/components/ui/button";
import { Search, User, Loader2, Trophy } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { type RunningRank, type MyRecord } from "../api/getRunningRankings";
import FilterSection from "./FilterSection";
import RankingList from "./RankingList";
import MyRankCard from "./MyRankCard";

interface PersonalRecordSectionProps {
  selectedSchool: string;
  setSelectedSchool: (school: string) => void;
  selectedEvent: "TEN_KM" | "HALF" | "FULL";
  setSelectedEvent: (event: "TEN_KM" | "HALF" | "FULL") => void;
  selectedGender: "MALE" | "FEMALE" | "ALL";
  setSelectedGender: (gender: "MALE" | "FEMALE" | "ALL") => void;
  selectedGraduationStatus: "ENROLLED" | "GRADUATED" | "ALL";
  setSelectedGraduationStatus: (
    status: "ENROLLED" | "GRADUATED" | "ALL"
  ) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isIntegratedRanking: boolean;
  setIsIntegratedRanking: (integrated: boolean) => void;
  isFilterExpanded: boolean;
  setIsFilterExpanded: (expanded: boolean) => void;
  isLoadingRankings: boolean;
  fetchRankings: () => void;
  handleResetFilter: () => void;
  universities: string[];
  isLoadingUniversities: boolean;
  hasSearched: boolean;
  rankingsData: RunningRank[];
  myRecordData: MyRecord | null;
  openCard: string | null;
  setOpenCard: (id: string | null) => void;
}

export default function PersonalRecordSection({
  selectedSchool,
  setSelectedSchool,
  selectedEvent,
  setSelectedEvent,
  selectedGender,
  setSelectedGender,
  selectedGraduationStatus,
  setSelectedGraduationStatus,
  searchQuery,
  setSearchQuery,
  isIntegratedRanking,
  setIsIntegratedRanking,
  isFilterExpanded,
  setIsFilterExpanded,
  isLoadingRankings,
  fetchRankings,
  handleResetFilter,
  universities,
  isLoadingUniversities,
  hasSearched,
  rankingsData,
  myRecordData,
  openCard,
  setOpenCard,
}: PersonalRecordSectionProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);

  const genders = [
    { value: "ALL", label: "전체" },
    { value: "MALE", label: "남성" },
    { value: "FEMALE", label: "여성" },
  ];

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
    <>
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

            {/* 안내문구 */}
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
        <div className="px-4 pb-6">
          <div className="bg-gray-50 rounded-3xl p-6 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold mb-2">개인 기록 랭킹</h3>
            <p className="text-gray-600 mb-4">
              학교별, 종목별 개인 기록 랭킹을
              <br />
              확인해보세요
            </p>
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
    </>
  );
}
