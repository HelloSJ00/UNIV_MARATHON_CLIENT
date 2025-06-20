import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Loader2 } from "lucide-react";

interface EmailStep2Props {
  email: string;
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  isVerifying: boolean;
  handleVerifyCode: () => void;
  handleSendVerification: () => void;
}

const EmailStep2 = ({
  email,
  verificationCode,
  setVerificationCode,
  isVerifying,
  handleVerifyCode,
  handleSendVerification,
}: EmailStep2Props) => (
  <div className="bg-gray-50 rounded-3xl p-6 space-y-6">
    <div className="text-center">
      <Mail className="w-12 h-12 text-blue-500 mx-auto mb-4" />
      <h2 className="text-xl font-bold mb-2">인증코드 입력</h2>
      <p className="text-gray-600">
        <span className="font-medium">{email}</span>로<br />
        발송된 인증코드를 입력해주세요
      </p>
    </div>
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">인증코드</label>
        <Input
          type="text"
          placeholder="6자리 인증코드 입력"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          className="h-12 rounded-2xl border-gray-200 text-center text-lg font-mono"
          maxLength={6}
        />
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-2">이메일을 받지 못하셨나요?</p>
        <Button
          variant="ghost"
          onClick={handleSendVerification}
          className="text-black hover:bg-gray-100 rounded-xl"
        >
          인증 이메일 재발송
        </Button>
      </div>
      <Button
        onClick={handleVerifyCode}
        disabled={verificationCode.length !== 6 || isVerifying}
        className="w-full h-14 bg-black text-white hover:bg-gray-800 rounded-2xl text-lg font-medium disabled:bg-gray-200 disabled:text-gray-500"
      >
        {isVerifying ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            인증 중...
          </>
        ) : (
          "인증 완료"
        )}
      </Button>
    </div>
  </div>
);

export default EmailStep2;
