import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Loader2, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";

interface RecordVerification {
  userId: number;
  recordVerificationId: number;
  imageUrl: string;
  marathonName: string;
  runningType: string;
  recordTime: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

interface AdminRecordCardProps {
  record: RecordVerification;
  processing: boolean;
  onApprove: () => void;
  onReject: () => void;
  imgError: boolean;
  onImgError: () => void;
}

const getRunningTypeLabel = (type: string) => {
  const typeMap: { [key: string]: string } = {
    TEN_KM: "10KM",
    HALF_MARATHON: "하프마라톤",
    FULL_MARATHON: "풀마라톤",
  };
  return typeMap[type] || type;
};

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

const AdminRecordCard = ({
  record,
  processing,
  onApprove,
  onReject,
  imgError,
  onImgError,
}: AdminRecordCardProps) => (
  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
    {/* Record Image */}
    <div className="aspect-video bg-gray-100 relative">
      <Image
        src={
          imgError
            ? "/placeholder.svg?height=200&width=400"
            : record.imageUrl || "/placeholder.svg?height=200&width=400"
        }
        alt="기록증"
        fill
        className="object-cover"
        onError={onImgError}
      />
      <div className="absolute top-3 right-3">
        <Badge className="bg-orange-500 hover:bg-orange-600">검토중</Badge>
      </div>
    </div>
    {/* Record Info */}
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-gray-400" />
          <span className="font-medium">{record.marathonName}</span>
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
          onClick={onApprove}
          disabled={processing}
          className="flex-1 h-12 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-medium"
        >
          {processing ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <CheckCircle className="w-4 h-4 mr-2" />
          )}
          승인
        </Button>
        <Button
          onClick={onReject}
          disabled={processing}
          variant="destructive"
          className="flex-1 h-12 rounded-2xl font-medium"
        >
          {processing ? (
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

export default AdminRecordCard;
