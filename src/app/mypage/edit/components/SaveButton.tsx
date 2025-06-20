import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import React from "react";

interface SaveButtonProps {
  isSaving: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SaveButton({ isSaving, onSubmit }: SaveButtonProps) {
  return (
    <div className="space-y-4 pb-6">
      <Button
        type="submit"
        disabled={isSaving}
        className="w-full h-14 bg-black text-white hover:bg-gray-800 rounded-2xl text-lg font-medium disabled:bg-gray-200 disabled:text-gray-500"
        onClick={onSubmit}
      >
        {isSaving ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            저장 중...
          </>
        ) : (
          <>
            <Save className="w-5 h-5 mr-2" />
            변경사항 저장
          </>
        )}
      </Button>
      {/* 안내사항 */}
      <div className="bg-blue-50 rounded-2xl p-4">
        <h4 className="font-medium text-blue-800 mb-2">ℹ️ 수정 안내</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 이메일은 로그인 ID로 사용되어 변경할 수 없습니다</li>
          <li>• 학교 변경시 대학교 이메일 재인증이 필요할 수 있습니다</li>
          <li>• 변경된 정보는 즉시 반영됩니다</li>
        </ul>
      </div>
    </div>
  );
}
