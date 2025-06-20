import { Button } from "@/components/ui/button";
import { Search, User, Trophy } from "lucide-react";
import React from "react";

interface InitialMessageProps {
  setIsFilterExpanded: (v: boolean) => void;
}

export default function InitialMessage({
  setIsFilterExpanded,
}: InitialMessageProps) {
  return (
    <div className="px-4 pb-6">
      <div className="bg-gray-50 rounded-3xl p-6 text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-bold mb-2">마라톤 랭킹 검색</h3>
        <p className="text-gray-600 mb-4">
          학교별 랭킹 또는 전국 통합 랭킹을
          <br />
          확인해보세요
        </p>
        <div className="flex flex-col gap-2 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>학교별 랭킹: 특정 학교 내에서의 순위</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-blue-500" />
            <span>통합 랭킹: 전국 모든 대학생 중 순위</span>
          </div>
        </div>
        <Button
          onClick={() => setIsFilterExpanded(true)}
          variant="outline"
          className="border-gray-200 hover:bg-gray-100 rounded-2xl"
        >
          검색 시작하기
        </Button>
      </div>
    </div>
  );
}
