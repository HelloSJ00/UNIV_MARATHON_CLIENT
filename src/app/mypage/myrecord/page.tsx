"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Clock, Calendar, Eye } from "lucide-react";
import Link from "next/link";
import CommonHeader from "../components/CommonHeader";
import { useQuery } from "@tanstack/react-query";
import { getRecords } from "@/app/api/records";

interface Record {
  runningType: "HALF" | "TEN_KM" | "FULL";
  marathonName: string;
  recordTime: number;
  imageUrl: string;
  createdAt: string;
  status: "VERIFIED" | "PENDING";
}

export default function MyRecordPage() {
  const [showAll, setShowAll] = useState(false);

  const { data: recordsResponse, isLoading } = useQuery({
    queryKey: ["records"],
    queryFn: getRecords,
  });

  const records = recordsResponse?.data || [];
  const displayedRecords = showAll ? records : records.slice(0, 3);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "VERIFIED":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "VERIFIED":
        return (
          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
        );
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "검토중";
      case "VERIFIED":
        return "승인";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-white text-black max-w-md mx-auto">
      <CommonHeader text="제출 기록증" />

      <div className="p-4">
        {/* 현재 검토중인 기록증 */}
        <div className="bg-gray-50 rounded-3xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">제출한 기록증</h2>
            <span className="text-sm text-gray-500">{records.length}개</span>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-gray-400 animate-spin" />
              </div>
              <p className="text-gray-500">기록을 불러오는 중...</p>
            </div>
          ) : records.length > 0 ? (
            <div className="space-y-3">
              {displayedRecords.map((record: Record, index: number) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-4 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                        <span className="font-bold text-sm">
                          {record.runningType === "TEN_KM"
                            ? "10KM"
                            : record.runningType}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{record.marathonName}</div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(record.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 font-mono font-bold">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {formatTime(record.recordTime)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div
                      className={`flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(
                        record.status
                      )}`}
                    >
                      {getStatusIcon(record.status)}
                      {getStatusText(record.status)}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-black rounded-xl"
                      onClick={() => window.open(record.imageUrl, "_blank")}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      상세보기
                    </Button>
                  </div>
                </div>
              ))}

              {records.length > 3 && (
                <Button
                  variant="ghost"
                  className="w-full text-gray-500 hover:text-black"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? "접기" : "더보기"}
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">제출한 기록증이 없습니다</p>
            </div>
          )}
        </div>

        {/* 기록증 업로드 버튼 */}
        <div className="mb-8">
          <Link href="/mypage/myrecord/uploadRecord">
            <Button className="w-full h-14 bg-black text-white hover:bg-gray-800 rounded-2xl text-lg font-medium flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              기록증 업로드
            </Button>
          </Link>
        </div>

        {/* 안내사항 */}
        <div className="bg-blue-50 rounded-2xl p-4">
          <h4 className="font-medium text-blue-800 mb-2">
            📋 기록증 제출 안내
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 공식 마라톤 대회의 기록증만 인정됩니다</li>
            <li>• 기록증에는 이름, 시간, 대회명이 명확히 표시되어야 합니다</li>
            <li>• 검토는 보통 1-3일 소요됩니다</li>
            <li>• 부정확한 정보 제출시 계정이 제재될 수 있습니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
