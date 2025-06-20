import React from "react";
import AdminRecordCard from "./AdminRecordCard";
import { Trophy, Loader2 } from "lucide-react";

interface RecordVerification {
  userId: number;
  recordVerificationId: number;
  imageUrl: string;
  marathonName: string;
  runningType: string;
  recordTime: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

interface AdminRecordListProps {
  records: RecordVerification[];
  isLoading: boolean;
  processingIds: Set<number>;
  imgErrorStates: { [key: number]: boolean };
  onApprove: (recordId: number, userId: number) => void;
  onReject: (recordId: number, userId: number) => void;
  onImgError: (recordId: number) => void;
}

const AdminRecordList = ({
  records,
  isLoading,
  processingIds,
  imgErrorStates,
  onApprove,
  onReject,
  onImgError,
}: AdminRecordListProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
        <p className="text-gray-500">검토 대기 기록을 불러오는 중...</p>
      </div>
    );
  }
  if (records.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-bold mb-2">검토 대기 기록 없음</h3>
        <p className="text-gray-600">현재 검토가 필요한 기록이 없습니다.</p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {records.map((record) => (
        <AdminRecordCard
          key={record.recordVerificationId}
          record={record}
          processing={processingIds.has(record.recordVerificationId)}
          onApprove={() =>
            onApprove(record.recordVerificationId, record.userId)
          }
          onReject={() => onReject(record.recordVerificationId, record.userId)}
          imgError={!!imgErrorStates[record.recordVerificationId]}
          onImgError={() => onImgError(record.recordVerificationId)}
        />
      ))}
    </div>
  );
};

export default AdminRecordList;
