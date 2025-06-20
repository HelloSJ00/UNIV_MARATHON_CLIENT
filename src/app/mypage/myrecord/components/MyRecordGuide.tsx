import React from "react";

const MyRecordGuide = () => (
  <div className="bg-blue-50 rounded-2xl p-4">
    <h4 className="font-medium text-blue-800 mb-2">📋 기록증 제출 안내</h4>
    <ul className="text-sm text-blue-700 space-y-1">
      <li>• 공식 마라톤 대회의 기록증만 인정됩니다</li>
      <li>• 기록증에는 이름, 시간, 대회명이 명확히 표시되어야 합니다</li>
      <li>• 검토는 보통 1-3일 소요됩니다</li>
      <li>• 부정확한 정보 제출시 계정이 제재될 수 있습니다</li>
      <li>
        • 검토중인 종목이 존재하는 종목의 기록증을 업로드하면 이전에 대기중인
        기록은 삭제됩니다
      </li>
    </ul>
    <p className="text-xs text-blue-700 mt-3">
      ※ 가장 최근에 업로드 된 기록으로 기록됩니다. 업로드가 실패하면 재시도를
      해주시기 바랍니다.
    </p>
  </div>
);

export default MyRecordGuide;
