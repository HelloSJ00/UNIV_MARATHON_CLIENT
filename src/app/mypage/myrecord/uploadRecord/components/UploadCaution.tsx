import React from "react";

const UploadCaution = () => (
  <div className="bg-yellow-50 rounded-2xl p-4">
    <h4 className="font-medium text-yellow-800 mb-2">⚠️ 제출 전 확인사항</h4>
    <ul className="text-sm text-yellow-700 space-y-1">
      <li>• 기록증 사진이 선명하고 모든 정보가 보이는지 확인하세요</li>
      <li>• 제출 후에는 수정이 불가능합니다</li>
    </ul>
    <p className="text-xs text-yellow-700 mt-3">
      ※ 가장 최근에 업로드 된 기록으로 기록됩니다. 업로드가 실패하면 재시도를
      해주시기 바랍니다.
    </p>
  </div>
);

export default UploadCaution;
