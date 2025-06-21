import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Shield, CheckCircle, Loader2 } from "lucide-react";

interface EmailStep1Props {
  email: string;
  setEmail: (email: string) => void;
  isEmailValid: boolean;
  isCheckingEmail: boolean;
  isSendingEmail: boolean;
  handleCheckEmail: () => void;
  handleSendVerification: () => void;
}

const EmailStep1 = ({
  email,
  setEmail,
  isEmailValid,
  isCheckingEmail,
  isSendingEmail,
  handleCheckEmail,
  handleSendVerification,
}: EmailStep1Props) => (
  <div className="bg-gray-50 rounded-3xl p-6 space-y-6">
    <div className="text-center">
      <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h2 className="text-xl font-bold mb-2">대학교 이메일 인증</h2>
      <p className="text-gray-600">
        재학 중인 대학교의 이메일 주소를 입력해주세요
      </p>
    </div>
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          대학교 이메일
        </label>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="email"
              placeholder="example@univ.kr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12 rounded-2xl border-gray-200"
            />
          </div>
          <Button
            onClick={handleCheckEmail}
            disabled={!email || isCheckingEmail}
            className="h-12 px-6 bg-black text-white hover:bg-gray-800 rounded-2xl"
          >
            {isCheckingEmail ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "확인하기"
            )}
          </Button>
        </div>
      </div>
      {isEmailValid && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-2xl">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">유효한 대학교 이메일입니다!</span>
          </div>
        </div>
      )}
      <Button
        onClick={handleSendVerification}
        disabled={!isEmailValid || isSendingEmail}
        className="w-full h-14 bg-black text-white hover:bg-gray-800 rounded-2xl text-lg font-medium disabled:bg-gray-200 disabled:text-gray-500"
      >
        {isSendingEmail ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            이메일 발송 중...
          </>
        ) : (
          "인증 메일 발송"
        )}
      </Button>
    </div>
    <div className="text-center mt-4">
      <p className="text-sm text-gray-500 mb-2">이메일 확인이 안된다면?</p>
      <a
        href="https://open.kakao.com/o/suC2y2Ch"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-4 py-2 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-500 transition"
      >
        오픈카톡 문의하기
      </a>
    </div>
  </div>
);

export default EmailStep1;
