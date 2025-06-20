import { Clock, User } from "lucide-react";
import Image from "next/image";
import React from "react";

interface Runner {
  user: {
    id: string;
    name: string;
    gender: "MALE" | "FEMALE";
    universityName: string;
    majorName?: string;
    studentNumber?: string;
    profileImageUrl?: string;
  };
  type: string;
  rank: number;
  recordTimeInSeconds: number;
}

interface RankingCardProps {
  runner: Runner;
  isOpen: boolean;
  onClick: () => void;
  isIntegratedRanking: boolean;
  formatTime: (seconds: number) => string;
  formatPace: (seconds: number, type: string) => string;
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
      className={`bg-white rounded-2xl p-4 border border-gray-100 transition-all duration-200 cursor-pointer ${
        isOpen ? "shadow-lg" : "hover:shadow"
      }`}
      onClick={onClick}
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
              <span className="font-medium">{runner.user.name}</span>
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
        <div className="flex flex-col items-end gap-1 text-sm font-mono">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-gray-400" />
            {formatTime(runner.recordTimeInSeconds)}
          </div>
          <div className="text-xs text-gray-500 font-mono mt-1">
            평균 페이스: {formatPace(runner.recordTimeInSeconds, runner.type)}
          </div>
        </div>
      </div>
      {/* 펼쳐지는 상세 정보 */}
      {isOpen && (
        <div className="mt-4 flex items-center gap-4 animate-fade-in">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 border flex items-center justify-center">
            {runner.user.profileImageUrl ? (
              <Image
                src={runner.user.profileImageUrl}
                alt="프로필"
                width={56}
                height={56}
                className="object-cover w-full h-full"
              />
            ) : (
              <User className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <div className="flex flex-col gap-1 text-sm text-gray-700">
            <div>{runner.user.majorName}</div>
            <div>
              {runner.user.studentNumber &&
                `${runner.user.studentNumber.substring(2, 4)}학번`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
