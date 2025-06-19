"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Shield, CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  verifyEmail,
  sendVerificationEmail,
  verifyCode,
} from "@/app/api/email";
import { useAuthStore } from "@/store/auth";
import CommonHeader from "../components/CommonHeader";
export default function EmailVerificationPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [step, setStep] = useState(1); // 1: 이메일 입력, 2: 인증코드 입력, 3: 완료
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // 이메일 확인하기
  const handleCheckEmail = async () => {
    if (!email) return;

    setIsCheckingEmail(true);

    try {
      const response = await verifyEmail(email);
      console.log("이메일 인증 응답:", response);

      if (response.status === 200 && response.data === true) {
        setIsEmailValid(true);
        alert(response.message);
      } else {
        setIsEmailValid(false);
        alert("올바른 대학교 이메일이 아닙니다.");
      }
    } catch (error) {
      console.error("이메일 인증 실패:", error);
      setIsEmailValid(false);
      alert("이메일 인증에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // 이메일 인증 발송
  const handleSendVerification = async () => {
    setIsSendingEmail(true);

    try {
      const response = await sendVerificationEmail(email);
      console.log("이메일 인증 발송 응답:", response);

      if (response.status === 200 && response.data === true) {
        setStep(2);
        alert(response.message);
      } else {
        alert("이메일 인증 발송에 실패했습니다.");
      }
    } catch (error) {
      console.error("이메일 인증 발송 실패:", error);
      alert("이메일 인증 발송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  // 인증코드 확인
  const handleVerifyCode = async () => {
    if (!verificationCode) return;

    setIsVerifying(true);

    try {
      const response = await verifyCode(email, verificationCode);
      console.log("인증코드 확인 응답:", response);

      if (response.status === 200 && response.data === true) {
        // Zustand store 업데이트
        if (user) {
          const updatedUser = {
            ...user,
            universityVerified: true,
            universityEmail: email,
          };
          setUser(updatedUser);
        }

        setStep(3);
        setTimeout(() => {
          router.push("/mypage");
        }, 2000);
      } else {
        alert("인증코드가 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("인증코드 확인 실패:", error);
      alert("인증코드 확인에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black max-w-md mx-auto">
      {/* Header */}
      <CommonHeader text="학교 인증" />

      <div className="p-4">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? "bg-black text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              1
            </div>
            <div
              className={`w-12 h-1 ${step >= 2 ? "bg-black" : "bg-gray-200"}`}
            ></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? "bg-black text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              2
            </div>
            <div
              className={`w-12 h-1 ${step >= 3 ? "bg-black" : "bg-gray-200"}`}
            ></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 3
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              ✓
            </div>
          </div>
        </div>

        {/* Step 1: 이메일 입력 */}
        {step === 1 && (
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
                    <span className="font-medium">
                      유효한 대학교 이메일입니다!
                    </span>
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
          </div>
        )}

        {/* Step 2: 인증코드 입력 */}
        {step === 2 && (
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
                <label className="text-sm font-medium text-gray-700">
                  인증코드
                </label>
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
                <p className="text-sm text-gray-500 mb-2">
                  이메일을 받지 못하셨나요?
                </p>
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
        )}

        {/* Step 3: 완료 */}
        {step === 3 && (
          <div className="bg-gray-50 rounded-3xl p-6 space-y-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2 text-green-700">
                인증 완료!
              </h2>
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
        )}

        {/* 도움말 */}
        {step <= 2 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
            <h4 className="font-medium text-blue-800 mb-2">💡 도움말</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 재학 중인 대학교의 공식 이메일을 사용해주세요</li>
              <li>• 인증 이메일이 스팸함에 있을 수 있습니다</li>
              <li>• 인증코드는 10분간 유효합니다</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
