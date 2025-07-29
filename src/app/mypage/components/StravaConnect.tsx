"use client";

// import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { connectStrava } from "../api/connectStrava";

const StravaConnect = () => {
  const user = useAuthStore((state) => state.user);
  const isConnected = user?.stravaConnected || false;
  const monthlyMileage = user?.totalDistanceKm ?? 0;
  const totalRuns = user?.totalActivityCount ?? 0;
  // avgPaceTime(초) → mm:ss 포맷
  const avgPaceSec = user?.avgPaceTime ?? 0;
  const avgPaceMin = Math.floor(avgPaceSec / 60);
  const avgPaceRemSec = Math.round(avgPaceSec % 60);
  const avgPaceStr = `${avgPaceMin}:${avgPaceRemSec
    .toString()
    .padStart(2, "0")}`;

  // 스트라바 연동 함수
  const handleStravaConnect = async () => {
    console.log("스트라바 연동 시작");
    try {
      await connectStrava();
      // connectStrava에서 브라우저가 리다이렉트되므로 여기서는 추가 작업 불필요
    } catch (error) {
      console.error("스트라바 연동 실패:", error);
      alert("스트라바 연동에 실패했습니다.");
    }
  };

  // 현재 월 가져오기
  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}년 ${now.getMonth() + 1}월`;
  };

  if (isConnected) {
    // 연동된 상태 - 마일리지 표시
    return (
      <div className="bg-gray-50 rounded-3xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">S</span>
          </div>
          <h3 className="text-lg font-bold">스트라바 연동</h3>
          <div className="ml-auto">
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              연동됨
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          {/* 이번달 마일리지 표시 */}
          <div className="text-center mb-4">
            <div className="text-sm text-gray-600 mb-1">
              {getCurrentMonth()} 누적 마일리지
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-1">
              {monthlyMileage.toFixed(1)}
              <span className="text-lg text-gray-500 ml-1">km</span>
            </div>
            <div className="text-xs text-gray-500">
              스트라바에서 매일 자정 자동 동기화
            </div>
          </div>

          {/* 최근 활동 요약 */}
          <div className="bg-gray-50 rounded-xl p-3 mb-4">
            <div className="text-sm font-medium text-gray-800 mb-2">
              이번 달 활동
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-lg font-bold text-gray-900">
                  {totalRuns}
                </div>
                <div className="text-xs text-gray-600">런</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">
                  {monthlyMileage.toFixed(1)}
                </div>
                <div className="text-xs text-gray-600">km</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">
                  {avgPaceStr}
                </div>
                <div className="text-xs text-gray-600">평균 페이스</div>
              </div>
            </div>
          </div>

          {/* 연동 관리 버튼들 */}
          {/* <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 h-10 border-gray-200 hover:bg-gray-50 rounded-xl text-sm bg-transparent"
              onClick={() => {
                // 스트라바 앱으로 이동 또는 새로고침
                alert("스트라바 데이터를 새로고침했습니다!");
                // 실제로는 API 재호출
                setMonthlyMileage((prev) => prev + Math.random() * 5); // Mock 업데이트
              }}
            >
              새로고침
            </Button> */}
          {/* <Button
              variant="outline"
              className="flex-1 h-10 border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-sm bg-transparent"
              onClick={handleStravaDisconnect}
            >
              연동 해제
            </Button> */}
          {/* </div> */}
        </div>
      </div>
    );
  }

  // 연동되지 않은 상태 - 연동 버튼 표시
  return (
    <div className="bg-gray-50 rounded-3xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
          <span className="text-white font-bold text-xs">S</span>
        </div>
        <h3 className="text-lg font-bold">스트라바 연동</h3>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg
              className="w-6 h-6 text-orange-600"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0l-7 13.828h4.172" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="font-medium text-base mb-1">
              스트라바와 연동하세요
            </div>
            <p className="text-sm text-gray-600 mb-3">
              스트라바 계정을 연동하면 마일리지 순위 계산에 활용됩니다
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                <div>월간 마일리지 자동 집계</div>
              </div>
            </div>
          </div>
        </div>

        <Button
          className="w-full h-12 bg-orange-500 text-white hover:bg-orange-600 rounded-2xl font-medium flex items-center justify-center gap-2"
          onClick={handleStravaConnect}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0l-7 13.828h4.172" />
          </svg>
          스트라바 연동하기
        </Button>
      </div>
    </div>
  );
};

export default StravaConnect;
