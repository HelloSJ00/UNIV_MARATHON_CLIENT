import React from "react";

interface EmailVerificationHelpProps {
  step: number;
}

const EmailVerificationHelp = ({ step }: EmailVerificationHelpProps) => {
  if (step > 2) return null;
  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
      <h4 className="font-medium text-blue-800 mb-2">💡 도움말</h4>
      <ul className="text-sm text-blue-700 space-y-1">
        <li>• 재학 중인 대학교의 공식 이메일을 사용해주세요</li>
        <li>• 인증 이메일이 스팸함에 있을 수 있습니다</li>
        <li>• 인증코드는 10분간 유효합니다</li>
      </ul>
    </div>
  );
};

export default EmailVerificationHelp;
