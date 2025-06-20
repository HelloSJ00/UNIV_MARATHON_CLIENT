import React from "react";
import { CheckCircle } from "lucide-react";

const EmailStep3 = () => (
  <div className="bg-gray-50 rounded-3xl p-6 space-y-6 text-center">
    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
      <CheckCircle className="w-10 h-10 text-green-500" />
    </div>
    <div>
      <h2 className="text-xl font-bold mb-2 text-green-700">인증 완료!</h2>
      <p className="text-gray-600">
        대학교 이메일 인증이 완료되었습니다.
        <br />
        이제 마라톤 기록을 등록할 수 있습니다.
      </p>
    </div>
    <div className="text-sm text-gray-500">
      잠시 후 내 정보 페이지로 이동합니다...
    </div>
  </div>
);

export default EmailStep3;
