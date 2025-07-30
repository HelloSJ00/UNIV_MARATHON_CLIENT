"use client";

import { Button } from "@/components/ui/button";
import { Search, Loader2, Trophy } from "lucide-react";
import { type MileageRunner as MileageRanking } from "./MileageRankingCard";
import { type MyMileageRecord } from "../api/getMileageRankings";
import MileageFilterSection from "./MileageFilterSection";
import MileageRankingList from "./MileageRankingList";
import MyMileageRankCard from "./MyMileageRankCard";

interface PersonalMileageSectionProps {
  selectedGender: "MALE" | "FEMALE" | "ALL";
  setSelectedGender: (gender: "MALE" | "FEMALE" | "ALL") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isIntegratedRanking: boolean;
  setIsIntegratedRanking: (integrated: boolean) => void;
  isMileageFilterExpanded: boolean;
  setIsMileageFilterExpanded: (expanded: boolean) => void;
  isLoadingMileageRankings: boolean;
  fetchMileageRankings: () => void;
  handleResetFilter: () => void;
  universities: string[];
  isLoadingUniversities: boolean;
  hasSearchedMileage: boolean;
  mileageRankingsData: MileageRanking[];
  myMileageRecordData: MyMileageRecord | null;
  openCard: string | null;
  setOpenCard: (id: string | null) => void;
}

export default function PersonalMileageSection({
  selectedGender,
  setSelectedGender,
  searchQuery,
  setSearchQuery,
  isIntegratedRanking,
  setIsIntegratedRanking,
  isMileageFilterExpanded,
  setIsMileageFilterExpanded,
  isLoadingMileageRankings,
  fetchMileageRankings,
  handleResetFilter,
  universities,
  isLoadingUniversities,
  hasSearchedMileage,
  mileageRankingsData,
  myMileageRecordData,
  openCard,
  setOpenCard,
}: PersonalMileageSectionProps) {
  const genders = [
    { value: "ALL", label: "전체" },
    { value: "MALE", label: "남성" },
    { value: "FEMALE", label: "여성" },
  ];

  const getGenderLabel = (value: string) => {
    const gender = genders.find((g) => g.value === value);
    return gender ? gender.label : value;
  };

  // 현재 월 가져오기
  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}년 ${now.getMonth() + 1}월`;
  };

  return (
    <>
      {/* 개인 마일리지 필터 섹션 */}
      <div className="p-4">
        <MileageFilterSection
          isFilterExpanded={isMileageFilterExpanded}
          setIsFilterExpanded={setIsMileageFilterExpanded}
          selectedGender={selectedGender}
          setSelectedGender={setSelectedGender}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isIntegratedRanking={isIntegratedRanking}
          setIsIntegratedRanking={setIsIntegratedRanking}
          isLoadingRankings={isLoadingMileageRankings}
          fetchRankings={fetchMileageRankings}
          handleResetFilter={handleResetFilter}
          universities={universities}
          isLoadingUniversities={isLoadingUniversities}
        />
      </div>

      {/* 마일리지 랭킹 섹션 */}
      {hasSearchedMileage ? (
        <div className="px-4 pb-6">
          <div className="bg-gray-50 rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg
                className="w-5 h-5 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              <h2 className="text-lg font-bold">
                {isIntegratedRanking
                  ? `전국 개인 마일리지 랭킹 (${getCurrentMonth()})`
                  : `${searchQuery} 개인 마일리지 랭킹 (${getCurrentMonth()})`}
              </h2>
            </div>

            {/* 검색 조건 표시 */}
            <div className="mb-4 p-3 bg-white rounded-2xl border border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
                <span>검색 조건:</span>
                <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                  스트라바 연동 유저
                </span>
                <span>•</span>
                <span className="font-medium text-black">이번달 마일리지</span>
                <span>•</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                  {getGenderLabel(selectedGender)}
                </span>
                {!isIntegratedRanking && searchQuery && (
                  <>
                    <span>•</span>
                    <span className="font-medium text-black">
                      {searchQuery}
                    </span>
                  </>
                )}
              </div>
            </div>

            {isLoadingMileageRankings ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">마일리지 랭킹을 불러오는 중...</p>
              </div>
            ) : mileageRankingsData.length > 0 ? (
              <>
                <MyMileageRankCard myInfo={myMileageRecordData ?? undefined} />
                <p className="text-sm text-gray-600 mb-6">
                  {isIntegratedRanking
                    ? `전국 스트라바 연동 유저 ${getGenderLabel(
                        selectedGender
                      )} 상위 ${
                        mileageRankingsData.length
                      }명의 이번달 마일리지 랭킹입니다`
                    : `${searchQuery} 스트라바 연동 유저 ${getGenderLabel(
                        selectedGender
                      )} 상위 ${
                        mileageRankingsData.length
                      }명의 이번달 마일리지 랭킹입니다`}
                </p>
                <MileageRankingList
                  rankingsData={mileageRankingsData}
                  openCard={openCard}
                  setOpenCard={setOpenCard}
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
              <svg
                className="w-8 h-8 text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">개인 마일리지 랭킹</h3>
            <p className="text-gray-600 mb-4">
              스트라바 연동 유저들의
              <br />
              이번달 마일리지 랭킹을 확인해보세요
            </p>
            <div className="flex flex-col gap-2 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-2 justify-center">
                <svg
                  className="w-4 h-4 text-orange-500"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0l-7 13.828h4.172" />
                </svg>
                <span>스트라바 연동 필수</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <Trophy className="w-4 h-4 text-orange-500" />
                <span>월간 마일리지 기준 랭킹</span>
              </div>
            </div>
            <Button
              onClick={() => setIsMileageFilterExpanded(true)}
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
