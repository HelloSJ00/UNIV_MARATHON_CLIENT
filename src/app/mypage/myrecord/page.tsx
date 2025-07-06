"use client";

import { useState } from "react";
import CommonHeader from "../../../components/common/CommonHeader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getRecords } from "./api/getRecords";
import MyRecordList from "./components/MyRecordList";
import UploadRecordButton from "./components/UploadRecordButton";
import MyRecordGuide from "./components/MyRecordGuide";

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
  const queryClient = useQueryClient();

  const { data: recordsResponse, isLoading } = useQuery({
    queryKey: ["records"],
    queryFn: getRecords,
  });
  const records: Record[] = recordsResponse?.data || [];

  const handleViewDetail = (url: string) => {
    window.open(url, "_blank");
  };

  const handleRecordsUpdate = (newRecords: Record[]) => {
    // Query cache를 업데이트하여 새로운 데이터를 반영
    queryClient.setQueryData(["records"], { data: newRecords });
  };

  return (
    <div className="min-h-screen bg-white text-black max-w-md mx-auto">
      <CommonHeader text="제출 기록증" />
      <div className="p-4">
        <MyRecordList
          records={records}
          isLoading={isLoading}
          showAll={showAll}
          setShowAll={setShowAll}
          onViewDetail={handleViewDetail}
          onRecordsUpdate={handleRecordsUpdate}
        />
        <UploadRecordButton />
        <MyRecordGuide />
      </div>
    </div>
  );
}
