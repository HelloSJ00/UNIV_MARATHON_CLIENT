import { Trophy, Clock } from "lucide-react";
import React from "react";
import { User } from "@/store/auth";

interface RecordSectionProps {
  user: User;
}

const eventNames = {
  TEN_KM: "10KM",
  HALF: "HALF",
  FULL: "FULL",
};

export default function RecordSection({ user }: RecordSectionProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
    } else {
      return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }
  };
  const formatPace = (seconds: number, eventType: string) => {
    // 각 종목별 거리 (km)
    const distances = {
      FIVE_KM: 5,
      TEN_KM: 10,
      HALF_MARATHON: 21.1,
      FULL_MARATHON: 42.195,
    };

    const distance = distances[eventType as keyof typeof distances];
    if (!distance) return "-";

    const pacePerKm = seconds / distance;
    const minutes = Math.floor(pacePerKm / 60);
    const remainingSeconds = Math.floor(pacePerKm % 60);

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}/km`;
  };
  return (
    <div className="bg-gray-50 rounded-3xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-5 h-5" />
        <h3 className="text-lg font-bold">내 기록</h3>
      </div>

      <div className="space-y-4">
        {Object.entries(eventNames).map(([key, name]) => {
          const record =
            user.runningRecords?.[key as keyof typeof user.runningRecords] ||
            null;

          return (
            <div
              key={key}
              className="bg-white rounded-2xl p-4 border border-gray-100"
            >
              {/* 상단: 종목 정보 */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-xs">
                    {key === "FIVE_KM"
                      ? "5K"
                      : key === "TEN_KM"
                      ? "10K"
                      : key === "HALF"
                      ? "HALF"
                      : key === "FULL"
                      ? "FULL"
                      : key}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-base">{name}</h4>
                  {record ? (
                    <div
                      className="text-sm text-gray-600 truncate"
                      title={record.marathonName}
                    >
                      🏃‍♂️ {record.marathonName}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">기록 없음</p>
                  )}
                </div>
              </div>

              {/* 하단: 기록 정보 */}
              {record ? (
                <div className="space-y-2">
                  {/* 완주 시간 */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">완주 시간</span>
                    <div className="flex items-center gap-1 font-mono font-bold text-lg">
                      <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="whitespace-nowrap">
                        {formatTime(record.recordTimeInSeconds)}
                      </span>
                    </div>
                  </div>
                  {/* 평균 페이스 */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">평균 페이스</span>
                    <div className="text-sm font-mono text-gray-700 bg-gray-50 px-2 py-1 rounded-lg">
                      {formatPace(record.recordTimeInSeconds, key)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500"></span>
                  <span className="text-gray-400 text-lg">-</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
