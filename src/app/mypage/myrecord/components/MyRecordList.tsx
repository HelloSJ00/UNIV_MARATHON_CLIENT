import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, RefreshCw } from "lucide-react";
import MyRecordCard from "./MyRecordCard";
import { getRecords, Record } from "../api/getRecords";

interface MyRecordListProps {
  records: Record[];
  isLoading: boolean;
  showAll: boolean;
  setShowAll: (show: boolean) => void;
  onViewDetail: (url: string) => void;
  onRecordsUpdate: (records: Record[]) => void;
}

const MyRecordList = ({
  records,
  isLoading,
  showAll,
  setShowAll,
  onViewDetail,
  onRecordsUpdate,
}: MyRecordListProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const displayedRecords = showAll ? records : records.slice(0, 3);

  const handleRefresh = async () => {
    console.log("새로고침 버튼 클릭됨");
    console.log("isLoading:", isLoading, "isRefreshing:", isRefreshing);

    if (isLoading || isRefreshing) {
      console.log("로딩 중이므로 새로고침 중단");
      return;
    }

    console.log("새로고침 시작");
    setIsRefreshing(true);
    try {
      console.log("API 호출 시작");
      const response = await getRecords();
      console.log("API 응답 받음:", response);
      onRecordsUpdate(response.data);
      console.log("부모 컴포넌트에 데이터 전달 완료");
    } catch (error) {
      console.error("기록을 새로고침하는 중 오류가 발생했습니다:", error);
    } finally {
      console.log("새로고침 완료");
      setIsRefreshing(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-3xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold">제출한 기록증</h2>
          <span className="text-sm text-gray-500">{records.length}개</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading || isRefreshing}
          className="p-2 hover:bg-gray-200 rounded-full"
        >
          <RefreshCw
            className={`w-4 h-4 text-gray-500 ${
              isRefreshing ? "animate-spin" : ""
            }`}
          />
        </Button>
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
