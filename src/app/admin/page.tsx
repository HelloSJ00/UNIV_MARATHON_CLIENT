"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Trophy,
  User,
  Loader2,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
import axios from "@/lib/axios";
import { useAuthStore } from "@/store/auth";
import { AdminConfirm, AdminReject } from "@/app/api/adminRecords";

// API 응답 타입 정의
interface RecordVerification {
  userId: number;
  recordVerificationId: number;
  imageUrl: string;
  marathonName: string;
  runningType: string;
  recordTime: number; // 초 단위
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export default function AdminPage() {
  const [records, setRecords] = useState<RecordVerification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());
  const [imgErrorStates, setImgErrorStates] = useState<{
    [key: number]: boolean;
  }>({});
  const accessToken = useAuthStore((state) => state.accessToken);

  // 종목 타입 변환
  const getRunningTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      TEN_KM: "10KM",
      HALF_MARATHON: "하프마라톤",
      FULL_MARATHON: "풀마라톤",
    };
    return typeMap[type] || type;
  };

  // 시간 포맷 변환 (초 -> HH:MM:SS 또는 MM:SS)
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
    } else {
      return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }
  };

  // 데이터 로드
  const loadRecords = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_SERVER_API_URL}/admin/record-verifications`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setRecords(response.data.content);
    } catch {
      alert("기록 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApprove = async (recordId: number, userId: number) => {
    setProcessingIds((prev) => new Set(prev).add(recordId));
    try {
      console.log(
        "[승인 요청] userId:",
        userId,
        "recordVerificationId:",
        recordId
      );
      const res = await AdminConfirm(userId, recordId);
      console.log("[승인 응답]", res);
      setRecords((prev) =>
        prev.filter((record) => record.recordVerificationId !== recordId)
      );
    } catch (e) {
      console.error("[승인 에러]", e);
      alert("승인 처리 중 오류가 발생했습니다.");
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(recordId);
        return newSet;
      });
    }
  };

  const handleReject = async (recordId: number, userId: number) => {
    setProcessingIds((prev) => new Set(prev).add(recordId));
    try {
      console.log(
        "[거절 요청] userId:",
        userId,
        "recordVerificationId:",
        recordId
      );
      const res = await AdminReject(userId, recordId);
      console.log("[거절 응답]", res);
      setRecords((prev) =>
        prev.filter((record) => record.recordVerificationId !== recordId)
      );
    } catch (e) {
      console.error("[거절 에러]", e);
      alert("거절 처리 중 오류가 발생했습니다.");
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(recordId);
        return newSet;
      });
    }
  };

  const refresh = () => {
    loadRecords();
  };

  return (
    <div className="min-h-screen bg-white text-black max-w-md mx-auto">
      {/* Admin Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-red-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">관리자</h1>
            <p className="text-sm text-red-600">기록 검토 시스템</p>
          </div>
        </div>
        <Button
          onClick={refresh}
          variant="ghost"
          size="sm"
          className="text-red-600 hover:bg-red-100 rounded-full p-2"
        >
          <RefreshCw className="w-5 h-5" />
        </Button>
      </div>

      {/* Stats */}
      <div className="p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">검토 대기중</span>
          </div>
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
            {records.length}건
          </Badge>
        </div>
      </div>

      {/* Records List */}
      <div className="p-4">
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">검토 대기 기록을 불러오는 중...</p>
          </div>
        ) : records.length > 0 ? (
          <div className="space-y-4">
            {records.map((record) => {
              return (
                <div
                  key={record.recordVerificationId}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
                >
                  {/* Record Image */}
                  <div className="aspect-video bg-gray-100 relative">
                    <Image
                      src={
                        imgErrorStates[record.recordVerificationId]
                          ? "/placeholder.svg?height=200&width=400"
                          : record.imageUrl ||
                            "/placeholder.svg?height=200&width=400"
                      }
                      alt="기록증"
                      fill
                      className="object-cover"
                      onError={() =>
                        setImgErrorStates((prev) => ({
                          ...prev,
                          [record.recordVerificationId]: true,
                        }))
                      }
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-orange-500 hover:bg-orange-600">
                        검토중
                      </Badge>
                    </div>
                  </div>

                  {/* Record Info */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-gray-400" />
                        <span className="font-medium">
                          {record.marathonName}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        ID: {record.recordVerificationId}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">종목</p>
                        <p className="font-medium">
                          {getRunningTypeLabel(record.runningType)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">기록</p>
                        <p className="font-mono font-bold text-lg">
                          {formatTime(record.recordTime)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">사용자 ID</p>
                      <p className="font-medium">#{record.userId}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      <Button
                        onClick={() =>
                          handleApprove(
                            record.recordVerificationId,
                            record.userId
                          )
                        }
                        disabled={processingIds.has(
                          record.recordVerificationId
                        )}
                        className="flex-1 h-12 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-medium"
                      >
                        {processingIds.has(record.recordVerificationId) ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-2" />
                        )}
                        승인
                      </Button>
                      <Button
                        onClick={() =>
                          handleReject(
                            record.recordVerificationId,
                            record.userId
                          )
                        }
                        disabled={processingIds.has(
                          record.recordVerificationId
                        )}
                        variant="destructive"
                        className="flex-1 h-12 rounded-2xl font-medium"
                      >
                        {processingIds.has(record.recordVerificationId) ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <XCircle className="w-4 h-4 mr-2" />
                        )}
                        거절
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold mb-2">검토 대기 기록 없음</h3>
            <p className="text-gray-600">현재 검토가 필요한 기록이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
