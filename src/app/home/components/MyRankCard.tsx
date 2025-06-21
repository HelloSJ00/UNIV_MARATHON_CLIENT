import { Trophy, User } from "lucide-react";
import React from "react";

// 프로젝트의 데이터 구조에 맞게 타입 정의
interface MyRankInfo {
  rank: number;
  recordTimeInSeconds: number;
  type: "TEN_KM" | "HALF" | "FULL";
  user: {
    name: string;
    gender: "MALE" | "FEMALE";
    universityName: string;
    profileImageUrl?: string | null;
  };
  totalCount?: number;
  isInTop10?: boolean;
}

interface MyRankCardProps {
  myInfo?: MyRankInfo; // 내 순위 정보가 없을 수도 있으므로 optional
  formatTime: (seconds: number) => string;
  formatPace: (seconds: number, type: "TEN_KM" | "HALF" | "FULL") => string;
}

export default function MyRankCard({
  myInfo,
  formatTime,
  formatPace,
}: MyRankCardProps) {
  // 내 정보가 없으면 카드를 렌더링하지 않음
  if (!myInfo) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl p-4 border-2 border-blue-200 mb-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-blue-600" />
        </div>
        <span className="font-medium text-blue-800">내 순위</span>
      </div>

      <div className="bg-gray-50 rounded-xl p-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">순위</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-blue-600">
              {myInfo.rank}위
            </span>
            {myInfo.totalCount && (
              <span className="text-sm text-gray-500">
                / {myInfo.totalCount}명
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">기록</span>
          <div className="text-right">
            <div className="font-mono font-bold">
              {formatTime(myInfo.recordTimeInSeconds)}
            </div>
            <div className="text-xs text-gray-500 font-mono">
              {formatPace(myInfo.recordTimeInSeconds, myInfo.type)}
            </div>
          </div>
        </div>
      </div>

      {myInfo.isInTop10 && (
        <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 rounded-lg p-2">
          <Trophy className="w-4 h-4" />
          <span>상위 10위 안에 들었습니다!</span>
        </div>
      )}
    </div>
  );
}
