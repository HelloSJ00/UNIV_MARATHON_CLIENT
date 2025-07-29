"use client";

import { User } from "lucide-react";
import Image from "next/image";

export interface MileageRunner {
  userId: number;
  name: string;
  gender: "MALE" | "FEMALE";
  universityName: string;
  studentNumber: string | null;
  profileImageUrl: string | null;
  majorName: string;
  graduationStatus: "ENROLLED" | "GRADUATED";
  totalDistanceKm: number;
  totalActivityCount: number;
  avgPaceTime: number;
  rank: number;
  nameVisible: boolean;
  studentNumberVisible: boolean;
  majorVisible: boolean;
}

interface MileageRankingListProps {
  rankingsData: MileageRunner[];
  openCard: string | null;
  setOpenCard: (id: string | null) => void;
}

export default function MileageRankingList({
  rankingsData,
  openCard,
  setOpenCard,
}: MileageRankingListProps) {
  const getGraduationStatusLabel = (status: string) => {
    switch (status) {
      case "ENROLLED":
        return "재학생";
      case "GRADUATED":
        return "졸업생";
      default:
        return "재학생";
    }
  };

  const getGraduationStatusColor = (status: string) => {
    switch (status) {
      case "ENROLLED":
        return "bg-green-100 text-green-700 border-green-200";
      case "GRADUATED":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-green-100 text-green-700 border-green-200";
    }
  };

  // 현재 월 가져오기
  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}년 ${now.getMonth() + 1}월`;
  };

  // 평균 페이스 변환 함수
  const formatPace = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "-";
    const min = Math.floor(seconds / 60);
    const sec = Math.round(seconds % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-3">
      {rankingsData.map((runner) => {
        const cardId = `${runner.userId}-${runner.rank}`;
        const isOpen = openCard === cardId;

        return (
          <div
            key={cardId}
            className={`bg-white rounded-2xl border border-gray-100 transition-all duration-300 cursor-pointer overflow-hidden ${
              isOpen
                ? "shadow-lg ring-2 ring-orange-100 border-orange-200"
                : "hover:shadow-md hover:border-gray-200"
            }`}
            onClick={() => setOpenCard(isOpen ? null : cardId)}
          >
            {/* 메인 카드 내용 */}
            <div className="p-4">
              {/* 상단: 순위 + 이름/성별 + 학교 */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
                  {runner.rank || 0}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className="font-semibold text-gray-900 text-base"
                      title={runner.name || ""}
                    >
                      {runner.name || "Unknown"}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                        runner.gender === "MALE"
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : "bg-pink-100 text-pink-700 border border-pink-200"
                      }`}
                    >
                      {runner.gender === "MALE" ? "남" : "여"}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium border flex-shrink-0 ${getGraduationStatusColor(
                        runner.graduationStatus
                      )}`}
                    >
                      {getGraduationStatusLabel(runner.graduationStatus)}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                      <svg
                        className="w-3 h-3"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0l-7 13.828h4.172" />
                      </svg>
                      <span>스트라바</span>
                    </div>
                  </div>
                  <div
                    className="text-sm text-gray-600 font-medium truncate"
                    title={runner.universityName || ""}
                  >
                    {runner.universityName || "Unknown University"}
                  </div>
                </div>
              </div>

              {/* 하단: 마일리지 정보 - 강조된 디자인 */}
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-3 border border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex flex-col items-start">
                    <div className="text-xs text-orange-600 font-semibold mb-1 flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {getCurrentMonth()} 마일리지
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-2xl font-bold text-orange-700">
                        <svg
                          className="w-5 h-5 text-orange-500 flex-shrink-0"
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
                        <span className="whitespace-nowrap">
                          {runner.totalDistanceKm.toFixed(1)}
                        </span>
                        <span className="text-lg text-orange-600">km</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-orange-600 font-medium mb-1">
                      평균 페이스
                    </div>
                    <div className="text-sm font-mono font-bold text-orange-700 bg-white px-2 py-1 rounded-lg border border-orange-200">
                      {formatPace(runner.avgPaceTime)}/km
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 펼쳐지는 상세 정보 */}
            {isOpen && (
              <div className="border-t border-gray-100 bg-gray-50 p-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-white border-2 border-gray-200 shadow-sm flex items-center justify-center flex-shrink-0">
                    {runner.profileImageUrl ? (
                      <Image
                        src={runner.profileImageUrl || "/placeholder.svg"}
                        alt="프로필"
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <User className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 space-y-3 min-w-0">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 font-medium mb-1">
                          전공
                        </p>
                        <p
                          className="text-sm font-medium text-gray-800 truncate"
                          title={runner.majorName || ""}
                        >
                          {runner.majorName || "-"}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 font-medium mb-1">
                          학번
                        </p>
                        <p className="text-sm font-medium text-gray-800">
                          {runner.studentNumber
                            ? `${runner.studentNumber}학번`
                            : "-"}
                        </p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500 font-medium mb-2 flex items-center gap-1">
                        <svg
                          className="w-3 h-3 text-orange-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {getCurrentMonth()} 상세 기록
                      </p>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            총 마일리지
                          </span>
                          <span className="font-bold text-orange-600">
                            {runner.totalDistanceKm.toFixed(1)}km
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            총 런 횟수
                          </span>
                          <span className="font-medium text-gray-800">
                            {runner.totalActivityCount}회
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            평균 페이스
                          </span>
                          <span className="font-mono text-sm text-gray-800">
                            {formatPace(runner.avgPaceTime)}/km
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            회당 평균 거리
                          </span>
                          <span className="font-mono text-sm text-gray-800">
                            {runner.totalActivityCount > 0
                              ? (
                                  runner.totalDistanceKm /
                                  runner.totalActivityCount
                                ).toFixed(1)
                              : "-"}
                            km
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
