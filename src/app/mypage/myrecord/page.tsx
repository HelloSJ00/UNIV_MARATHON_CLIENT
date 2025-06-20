"use client";

import { useState } from "react";
import CommonHeader from "../../../components/common/CommonHeader";
import { useQuery } from "@tanstack/react-query";
import { getRecords } from "@/app/api/records";
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
  const { data: recordsResponse, isLoading } = useQuery({
    queryKey: ["records"],
    queryFn: getRecords,
  });
  const records: Record[] = recordsResponse?.data || [];

  const handleViewDetail = (url: string) => {
    window.open(url, "_blank");
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
        />
        <UploadRecordButton />
        <MyRecordGuide />
      </div>
    </div>
  );
}
