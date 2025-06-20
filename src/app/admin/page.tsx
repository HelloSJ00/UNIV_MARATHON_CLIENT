"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useAuthStore } from "@/store/auth";
import { AdminConfirm } from "./api/adminConfirm";
import { AdminReject } from "./api/adminReject";
import AdminHeader from "./components/AdminHeader";
import AdminStats from "./components/AdminStats";
import AdminRecordList from "./components/AdminRecordList";

// API 응답 타입 정의
interface RecordVerification {
  userId: number;
  recordVerificationId: number;
  imageUrl: string;
  marathonName: string;
  runningType: string;
  recordTime: number;
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
      await AdminConfirm(userId, recordId);
      setRecords((prev) =>
        prev.filter((record) => record.recordVerificationId !== recordId)
      );
    } catch {
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
      await AdminReject(userId, recordId);
      setRecords((prev) =>
        prev.filter((record) => record.recordVerificationId !== recordId)
      );
    } catch {
      alert("거절 처리 중 오류가 발생했습니다.");
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(recordId);
        return newSet;
      });
    }
  };

  const handleImgError = (recordId: number) => {
    setImgErrorStates((prev) => ({ ...prev, [recordId]: true }));
  };

  const refresh = () => {
    loadRecords();
  };

  return (
    <div className="min-h-screen bg-white text-black max-w-md mx-auto">
      <AdminHeader onRefresh={refresh} />
      <AdminStats count={records.length} />
      <div className="p-4">
        <AdminRecordList
          records={records}
          isLoading={isLoading}
          processingIds={processingIds}
          imgErrorStates={imgErrorStates}
          onApprove={handleApprove}
          onReject={handleReject}
          onImgError={handleImgError}
        />
      </div>
    </div>
  );
}
