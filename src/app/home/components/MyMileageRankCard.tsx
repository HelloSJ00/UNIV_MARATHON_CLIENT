"use client";

import { Trophy, User } from "lucide-react";
import Image from "next/image";

// 마일리지 랭킹용 내 정보 타입 정의
interface MyMileageRankInfo {
  rank: number;
  name: string;
  gender: "MALE" | "FEMALE";
  universityName: string;
  profileImageUrl?: string | null;
  totalDistanceKm: number;
  totalActivityCount: number;
  avgPaceTime: number;
  totalCount?: number;
  ranking: number;
}

interface MileageMyRankCardProps {
  myInfo?: MyMileageRankInfo;
}

export default function MyMileageRankCard({ myInfo }: MileageMyRankCardProps) {
  // 내 정보가 없으면 카드를 렌더링하지 않음
  if (!myInfo) {
    return null;
  }

  // 현재 월 가져오기
  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}년 ${now.getMonth() + 1}월`;
  };

  const totalDistance = myInfo.totalDistanceKm || 0;

  return (
    <div className="bg-white rounded-2xl p-4 border-2 border-orange-200 mb-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-orange-600" />
        </div>
        <span className="font-medium text-orange-800">내 마일리지 순위</span>
        <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0l-7 13.828h4.172" />
          </svg>
          <span>스트라바</span>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center relative overflow-hidden">
          {myInfo.profileImageUrl ? (
            <Image
              src={myInfo.profileImageUrl || "/placeholder.svg"}
              alt="내 프로필"
              className="object-cover rounded-full"
              fill
              priority
            />
          ) : (
            <User className="w-5 h-5 text-gray-400" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">{myInfo.name}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                myInfo.gender === "MALE"
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "bg-pink-100 text-pink-700 border border-pink-200"
              }`}
            >
              {myInfo.gender === "MALE" ? "남" : "여"}
            </span>
          </div>
          <div className="text-sm text-gray-600">{myInfo.universityName}</div>
        </div>
      </div>

      {/* 마일리지 정보 - 강조된 디자인 */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-3 mb-3 border border-orange-200">
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
              <div className="flex items-center gap-1 text-xl font-bold text-orange-700">
                <svg
                  className="w-4 h-4 text-orange-500 flex-shrink-0"
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
                  {totalDistance.toFixed(1)}
                </span>
                <span className="text-base text-orange-600">km</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-orange-600 font-medium mb-1">순위</div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-orange-700">
                {myInfo.ranking}위
              </span>
              {myInfo.totalCount && (
                <span className="text-sm text-orange-600">
                  / {myInfo.totalCount}명
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 순위별 축하 메시지 */}
      {myInfo.ranking <= 10 && (
        <div className="flex items-center gap-2 text-sm text-yellow-600 bg-yellow-50 rounded-lg p-2">
          <Trophy className="w-4 h-4" />
          <span>마일리지 상위 10위 안에 들었습니다! 🏆</span>
        </div>
      )}
      {myInfo.ranking > 10 && myInfo.ranking <= 50 && (
        <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 rounded-lg p-2">
          <Trophy className="w-4 h-4" />
          <span>마일리지 상위 50위 안에 들었습니다! 🥈</span>
        </div>
      )}
      {myInfo.ranking > 50 && myInfo.ranking <= 100 && (
        <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 rounded-lg p-2">
          <Trophy className="w-4 h-4" />
          <span>마일리지 상위 100위 안에 들었습니다! 🥉</span>
        </div>
      )}
    </div>
  );
}
