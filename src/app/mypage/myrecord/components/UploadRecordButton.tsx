import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const UploadRecordButton = () => (
  <div className="mb-8">
    <Link href="/mypage/myrecord/uploadRecord">
      <Button className="w-full h-14 bg-black text-white hover:bg-gray-800 rounded-2xl text-lg font-medium flex items-center justify-center gap-2">
        <Plus className="w-5 h-5" />
        기록증 업로드
      </Button>
    </Link>
  </div>
);

export default UploadRecordButton;
