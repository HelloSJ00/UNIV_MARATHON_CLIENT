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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <span className="font-bold text-sm">
                      {key === "TEN_KM" ? "10KM" : key}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium">{name}</h4>
                    {record ? (
                      <div className="text-sm text-gray-600">
                        {record.marathonName}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">기록 없음</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {record ? (
                    <div className="flex items-center gap-1 font-mono font-bold">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {Math.floor(record.recordTimeInSeconds / 3600)
                        .toString()
                        .padStart(2, "0")}
                      :
                      {Math.floor((record.recordTimeInSeconds % 3600) / 60)
                        .toString()
                        .padStart(2, "0")}
                      :
                      {(record.recordTimeInSeconds % 60)
                        .toString()
                        .padStart(2, "0")}
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
