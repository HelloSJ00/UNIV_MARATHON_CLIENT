import React from "react";
import { Calendar, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Record {
  runningType: "HALF" | "TEN_KM" | "FULL";
  marathonName: string;
  recordTime: number;
  imageUrl: string;
  createdAt: string;
  status: "VERIFIED" | "PENDING";
}

interface MyRecordCardProps {
  record: Record;
  onViewDetail: (url: string) => void;
}

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

const MyRecordCard = ({ record, onViewDetail }: MyRecordCardProps) => (
  <div className="bg-white rounded-2xl p-4 border border-gray-100">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
          <span className="font-bold text-sm">
            {record.runningType === "TEN_KM" ? "10KM" : record.runningType}
          </span>
        </div>
        <div>
          <div className="font-medium">{record.marathonName}</div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-3 h-3" />
            <span>{new Date(record.createdAt).toLocaleDateString()}</span>
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
        onClick={() => onViewDetail(record.imageUrl)}
      >
        <Eye className="w-4 h-4 mr-1" />
        상세보기
      </Button>
    </div>
  </div>
);

export default MyRecordCard;
