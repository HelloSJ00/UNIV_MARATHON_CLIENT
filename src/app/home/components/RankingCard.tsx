import { Clock, User } from "lucide-react";
import Image from "next/image";
import React from "react";

interface Runner {
  user?: {
    id: string;
    name: string;
    gender: "MALE" | "FEMALE";
    universityName: string;
    majorName?: string;
    studentNumber?: string;
    profileImageUrl?: string;
  };
  name?: string;
  gender?: string;
  school?: string;
  type?: "TEN_KM" | "HALF" | "FULL";
  rank: number;
  recordTimeInSeconds?: number;
  time?: string;
  marathonName?: string;
}

interface RankingCardProps {
  runner: Runner;
  isOpen: boolean;
  onClick: () => void;
  isIntegratedRanking: boolean;
  formatTime: (seconds: number) => string;
  formatPace: (seconds: number, type: "TEN_KM" | "HALF" | "FULL") => string;
}

export default function RankingCard({
  runner,
  isOpen,
  onClick,
  isIntegratedRanking,
  formatTime,
  formatPace,
}: RankingCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 transition-all duration-300 cursor-pointer overflow-hidden ${
        isOpen
          ? "shadow-lg ring-2 ring-blue-100 border-blue-200"
          : "hover:shadow-md hover:border-gray-200"
      }`}
      onClick={onClick}
    >
      {/* 메인 카드 내용 */}
      <div className="p-4">
        {/* 상단: 순위 + 이름/성별 + 학교 */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0 ${
              isIntegratedRanking ? "bg-blue-500" : "bg-black"
            }`}
          >
            {runner.rank}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="font-semibold text-gray-900 text-base"
                title={runner.user?.name || runner.name}
              >
                {runner.user?.name || runner.name}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                  runner.user?.gender === "MALE" || runner.gender === "male"
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "bg-pink-100 text-pink-700 border border-pink-200"
                }`}
              >
                {runner.user?.gender === "MALE" || runner.gender === "male"
                  ? "남"
                  : "여"}
              </span>
            </div>
            <div
              className="text-sm text-gray-600 font-medium truncate"
              title={runner.user?.universityName || runner.school}
            >
              {runner.user?.universityName || runner.school}
            </div>
          </div>
        </div>

        {/* 하단: 기록 정보 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-lg font-mono font-bold text-gray-900">
              <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="whitespace-nowrap">
                {runner.recordTimeInSeconds
                  ? formatTime(runner.recordTimeInSeconds)
                  : runner.time}
              </span>
            </div>
            {runner.recordTimeInSeconds && runner.type && (
              <div
                className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded-full whitespace-nowrap"
                title={`페이스: ${formatPace(
                  runner.recordTimeInSeconds,
                  runner.type
                )}`}
              >
                {formatPace(runner.recordTimeInSeconds, runner.type)}
              </div>
            )}
          </div>
          {runner.marathonName && (
            <div
              className="text-xs text-gray-500 truncate"
              title={runner.marathonName}
            >
              🏃‍♂️ {runner.marathonName}
            </div>
          )}
        </div>
      </div>

      {/* 펼쳐지는 상세 정보 */}
      {isOpen && (
        <div className="border-t border-gray-100 bg-gray-50 p-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-white border-2 border-gray-200 shadow-sm flex items-center justify-center flex-shrink-0">
              {runner.user?.profileImageUrl ? (
                <Image
                  src={runner.user.profileImageUrl || "/placeholder.svg"}
                  alt="프로필"
                  className="object-cover w-full h-full"
                  width={64}
                  height={64}
                  priority
                />
              ) : (
                <User className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div className="flex-1 space-y-3 min-w-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 font-medium mb-1">전공</p>
                  <p
                    className="text-sm font-medium text-gray-800 truncate"
                    title={runner.user?.majorName || "정보 없음"}
                  >
                    {runner.user?.majorName || "정보 없음"}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 font-medium mb-1">학번</p>
                  <p className="text-sm font-medium text-gray-800">
                    {runner.user?.studentNumber
                      ? `${runner.user.studentNumber.substring(2, 4)}학번`
                      : "정보 없음"}
                  </p>
                </div>
              </div>
              {runner.recordTimeInSeconds && runner.type && (
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500 font-medium mb-2">
                    상세 기록
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">완주 시간</span>
                      <span className="font-mono font-bold text-blue-600">
                        {formatTime(runner.recordTimeInSeconds)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">평균 페이스</span>
                      <span className="font-mono text-sm text-gray-800">
                        {formatPace(runner.recordTimeInSeconds, runner.type)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
