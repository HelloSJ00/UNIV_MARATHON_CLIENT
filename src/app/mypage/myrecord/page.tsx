"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Clock, Calendar, Eye, AlertCircle } from "lucide-react";
import Link from "next/link";
import MyrecordHeader from "./components/MyrecordHeader";

export default function MyRecordPage() {
  // Mock 검토중인 기록들
  const [pendingRecords] = useState([
    {
      id: 1,
      event: "10KM",
      time: "42:15",
      date: "2024-03-20",
      status: "검토중",
      submittedAt: "2024-03-21",
    },
    {
      id: 2,
      event: "HALF",
      time: "1:32:45",
      date: "2024-02-15",
      status: "승인",
      submittedAt: "2024-02-16",
      approvedAt: "2024-02-18",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "검토중":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "승인":
        return "text-green-600 bg-green-50 border-green-200";
      case "반려":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "검토중":
        return <Clock className="w-4 h-4" />;
      case "승인":
        return (
          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
        );
      case "반려":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-black max-w-md mx-auto">
      {/* Header */}
      <MyrecordHeader />

      <div className="p-4 space-y-6">
        {/* 현재 검토중인 기록증 */}
        <div className="bg-gray-50 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">제출한 기록증</h2>
            <span className="text-sm text-gray-500">
              {pendingRecords.length}개
            </span>
          </div>

          {pendingRecords.length > 0 ? (
            <div className="space-y-3">
              {pendingRecords.map((record) => (
                <div
                  key={record.id}
                  className="bg-white rounded-2xl p-4 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                        <span className="font-bold text-sm">
                          {record.event}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{record.event} 마라톤</div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-3 h-3" />
                          <span>{record.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 font-mono font-bold">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {record.time}
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
                      {record.status}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-black rounded-xl"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      상세보기
                    </Button>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      제출일: {record.submittedAt}
                      {record.approvedAt && ` • 승인일: ${record.approvedAt}`}
                    </p>
                  </div>
                </div>
              ))}
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
        <div className="space-y-4">
          <Link href="/mypage/myrecord/uploadRecord">
            <Button className="w-full h-14 bg-black text-white hover:bg-gray-800 rounded-2xl text-lg font-medium flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              기록증 업로드
            </Button>
          </Link>

          {/* 안내사항 */}
          <div className="bg-blue-50 rounded-2xl p-4">
            <h4 className="font-medium text-blue-800 mb-2">
              📋 기록증 제출 안내
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 공식 마라톤 대회의 기록증만 인정됩니다</li>
              <li>
                • 기록증에는 이름, 시간, 대회명이 명확히 표시되어야 합니다
              </li>
              <li>• 검토는 보통 1-3일 소요됩니다</li>
              <li>• 부정확한 정보 제출시 계정이 제재될 수 있습니다</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
