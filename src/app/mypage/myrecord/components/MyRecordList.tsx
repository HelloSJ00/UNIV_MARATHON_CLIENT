import React from "react";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import MyRecordCard from "./MyRecordCard";

interface Record {
  runningType: "HALF" | "TEN_KM" | "FULL";
  marathonName: string;
  recordTime: number;
  imageUrl: string;
  createdAt: string;
  status: "VERIFIED" | "PENDING";
}

interface MyRecordListProps {
  records: Record[];
  isLoading: boolean;
  showAll: boolean;
  setShowAll: (show: boolean) => void;
  onViewDetail: (url: string) => void;
}

const MyRecordList = ({
  records,
  isLoading,
  showAll,
  setShowAll,
  onViewDetail,
}: MyRecordListProps) => {
  const displayedRecords = showAll ? records : records.slice(0, 3);

  return (
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
          {displayedRecords.map((record, idx) => (
            <MyRecordCard
              key={idx}
              record={record}
              onViewDetail={onViewDetail}
            />
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
  );
};

export default MyRecordList;
