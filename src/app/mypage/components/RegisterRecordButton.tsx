import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";

interface RegisterRecordButtonProps {
  universityVerified: boolean;
}

export default function RegisterRecordButton({
  universityVerified,
}: RegisterRecordButtonProps) {
  return universityVerified ? (
    <Link href="/mypage/myrecord">
      <Button className="w-full h-14 bg-black text-white hover:bg-gray-800 rounded-2xl text-lg font-medium flex items-center justify-center gap-2">
        <Plus className="w-5 h-5" />내 기록 등록하기
      </Button>
    </Link>
  ) : (
    <div className="space-y-3">
      <Button
        disabled
        className="w-full h-14 bg-gray-200 text-gray-500 rounded-2xl text-lg font-medium cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />내 기록 등록하기
      </Button>
      <p className="text-center text-sm text-red-600">
        ⚠️ 기록 등록은 대학교 인증 후 가능합니다
      </p>
    </div>
  );
}
