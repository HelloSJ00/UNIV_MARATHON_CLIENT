"use client";

import { Button } from "@/components/ui/button";
import { Search, User, Loader2, Trophy } from "lucide-react";
import Image from "next/image";
import { type UniversityRanking } from "../api/getUniversityRankings";
import SegmentedControl from "./SegmentedControl";

interface UniversityRankingSectionProps {
  selectedEvent: "TEN_KM" | "HALF" | "FULL";
  setSelectedEvent: (event: "TEN_KM" | "HALF" | "FULL") => void;
  isUniversityRankingExpanded: boolean;
  setIsUniversityRankingExpanded: (expanded: boolean) => void;
  isLoadingUniversityRankings: boolean;
  fetchUniversityRankings: () => void;
  hasSearchedUniversityRanking: boolean;
  universityRankings: UniversityRanking[];
}

export default function UniversityRankingSection({
  selectedEvent,
  setSelectedEvent,
  isUniversityRankingExpanded,
  setIsUniversityRankingExpanded,
  isLoadingUniversityRankings,
  fetchUniversityRankings,
  hasSearchedUniversityRanking,
  universityRankings,
}: UniversityRankingSectionProps) {
  const eventOptions = [
    { label: "10km", value: "TEN_KM" },
    { label: "하프마라톤", value: "HALF" },
    { label: "풀마라톤", value: "FULL" },
  ];

  return (
    <>
      {/* 학교랭킹: 종목만 선택하는 필터 + 조회하기 버튼 */}
      <div className="p-4">
        <div className="bg-white border border-gray-200 rounded-3xl mb-4 shadow-sm">
          {/* 헤더 클릭 시 토글 */}
          <div
            className={`flex items-center gap-2 cursor-pointer select-none transition-all ${
              isUniversityRankingExpanded ? "mb-4 p-6" : "p-4"
            }`}
            onClick={() =>
              setIsUniversityRankingExpanded(!isUniversityRankingExpanded)
            }
          >
            <Trophy className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-bold flex-1">학교별 랭킹 조회</h2>
            <span>
              {isUniversityRankingExpanded ? (
                <svg className="w-5 h-5" viewBox="0 0 20 20">
                  <path
                    d="M6 8l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 20 20">
                  <path
                    d="M14 12l-4-4-4 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              )}
            </span>
          </div>

          {/* 펼쳐진 경우에만 필터/버튼 노출 */}
          {isUniversityRankingExpanded && (
            <div className="space-y-4 px-6 pb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  종목 선택
                </label>
                {/* 기존 Select → SegmentedControl로 변경 */}
                <SegmentedControl
                  options={eventOptions}
                  value={selectedEvent}
                  onChange={(value: string) =>
                    setSelectedEvent(value as "TEN_KM" | "HALF" | "FULL")
                  }
                />
              </div>
              <Button
                className="w-full h-12 bg-black text-white hover:bg-gray-800 rounded-2xl font-bold"
                onClick={fetchUniversityRankings}
                disabled={isLoadingUniversityRankings}
              >
                {isLoadingUniversityRankings ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    조회 중...
                  </div>
                ) : (
                  "조회하기"
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 조회하지 않았을 때 안내 메시지 */}
      {!hasSearchedUniversityRanking && (
        <div className="px-4 pb-6">
          <div className="bg-gray-50 rounded-3xl p-6 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold mb-2">학교별 완주자수 랭킹</h3>
            <p className="text-gray-600 mb-4">
              각 대학교별 마라톤 완주자 수를
              <br />
              확인해보세요
            </p>
            <div className="flex flex-col gap-2 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-2 justify-center">
                <Trophy className="w-4 h-4 text-blue-500" />
                <span>대학교별 완주자 수 순위</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <User className="w-4 h-4" />
                <span>종목별 상세 랭킹 제공</span>
              </div>
            </div>
            <a
              href="https://second-pony-0ca.notion.site/Univ-Marathon-Rank-218b52264a2d809faafaf470e1c92eae"
              target="_blank"
              rel="noopener noreferrer"
              className="block mb-3 text-blue-600 underline hover:text-blue-800 text-sm font-medium"
            >
              사용 가이드 및 안내
            </a>
            <p className="text-xs text-gray-500">
              위의 종목을 선택하고 조회하기 버튼을 눌러주세요
            </p>
          </div>
        </div>
      )}

      {/* 조회하기 버튼을 누른 후에만 리스트 표시 */}
      {hasSearchedUniversityRanking && (
        <div className="px-4 pb-6">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-blue-500" />
              학교별 완주자수 랭킹
              <span className="px-2 py-1 bg-black text-white rounded-full text-xs font-medium">
                {selectedEvent === "TEN_KM"
                  ? "10km"
                  : selectedEvent === "HALF"
                  ? "하프마라톤"
                  : "풀마라톤"}
              </span>
            </h2>

            {/* 검색 조건 표시 */}
            <div className="mb-4 p-3 bg-white rounded-2xl border border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
                <span>검색 조건:</span>
                <span className="px-2 py-1 bg-black text-white rounded-full text-xs font-medium">
                  {selectedEvent === "TEN_KM"
                    ? "10km"
                    : selectedEvent === "HALF"
                    ? "하프마라톤"
                    : "풀마라톤"}
                </span>
              </div>
            </div>

            {/* 안내문구는 학교랭킹에만 */}
            <p className="text-sm text-gray-600 mb-6">
              전국 상위 30개의 학교 랭킹을 확인할 수 있습니다
            </p>

            {isLoadingUniversityRankings ? (
              <div className="flex justify-center items-center h-24">
                <Loader2 className="animate-spin w-6 h-6 text-gray-400" />
              </div>
            ) : universityRankings.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p>랭킹 데이터가 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {universityRankings.map((item, index) => {
                  console.log(
                    "universityImage:",
                    item.universityImage,
                    "for",
                    item.universityName
                  );
                  return (
                    <div
                      key={item.universityName}
                      className={`flex items-center p-4 rounded-2xl transition-colors ${
                        index === 0
                          ? "bg-yellow-50 border border-yellow-200"
                          : index === 1
                          ? "bg-gray-50 border border-gray-200"
                          : index === 2
                          ? "bg-orange-50 border border-orange-200"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-4 ${
                          index === 0
                            ? "bg-yellow-500 text-white"
                            : index === 1
                            ? "bg-gray-400 text-white"
                            : index === 2
                            ? "bg-orange-500 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {item.ranking}
                      </div>
                      <div className="w-8 h-8 rounded-full overflow-hidden mr-3 bg-gray-100 flex-shrink-0">
                        <Image
                          src={item.universityImage || "/placeholder.svg"}
                          alt={`${item.universityName} 로고`}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <span className="font-medium">
                          {item.universityName}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-lg">
                          {item.finisherCount}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">명</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
