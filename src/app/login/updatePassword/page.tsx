"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import CommonHeader from "@/components/common/CommonHeader";
import { checkEmailAvailable } from "@/app/api/common/checkEmail";
import { sendEmailVerificationForPassword } from "@/app/login/updatePassword/api/sendEmailVerificationForPassword";
import { verifyCodeToPassword } from "./api/verifyCodeToPassword";
import { changePassword } from "./api/changePassword";

export default function UpdatePasswordPage() {
  const [step, setStep] = useState(1); // 1: 이메일 입력, 2: 인증코드 입력, 3: 새 비밀번호 설정, 4: 완료
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailCheckResult, setEmailCheckResult] = useState("none"); // "none", "found", "not-found"
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  // 이메일 확인 함수 수정
  const handleCheckEmail = async () => {
    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("올바른 이메일 형식이 아닙니다.");
      return;
    }

    setIsCheckingEmail(true);

    try {
      const isRegistered = await checkEmailAvailable(email);
      setEmailCheckResult(!isRegistered ? "found" : "not-found");
    } catch {
      setEmailCheckResult("not-found");
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // 이메일 확인 및 인증코드 발송
  const handleSendVerification = async () => {
    if (emailCheckResult !== "found") {
      alert("먼저 이메일을 확인해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await sendEmailVerificationForPassword(email);
      if (res.status === 200 && res.data === true) {
        setStep(2);
        alert("인증코드가 이메일로 발송되었습니다.");
      } else {
        alert(res.message || "이메일 발송에 실패했습니다.");
      }
    } catch {
      alert("이메일 발송 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 인증코드 확인
  const handleVerifyCode = async () => {
    if (!verificationCode) {
      alert("인증코드를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await verifyCodeToPassword(email, verificationCode);
      if (res.status === 200 && res.data === true) {
        setStep(3);
      } else {
        alert(res.message || "인증코드가 올바르지 않습니다.");
      }
    } catch {
      alert("인증코드 확인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 새 비밀번호 설정
  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    if (newPassword.length < 8) {
      alert("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await changePassword(email, newPassword);
      if (res.status === 200 && res.data === true) {
        setStep(4);
      } else {
        alert(res.message || "비밀번호 변경에 실패했습니다.");
      }
    } catch {
      alert("비밀번호 변경 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 인증코드 재발송
  const handleResendCode = () => {
    alert("인증코드가 재발송되었습니다.");
  };

  return (
    <div className="min-h-screen bg-white text-black max-w-md mx-auto">
      {/* Header */}
      <CommonHeader text="비밀번호 찾기" />

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
                step >= 3 ? "bg-black text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              3
            </div>
            <div
              className={`w-12 h-1 ${
                step >= 4 ? "bg-green-500" : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 4
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
              <Mail className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">이메일 확인</h2>
              <p className="text-gray-600">
                가입시 사용한 이메일 주소를 입력해주세요
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  이메일
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="example@skku.edu"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailCheckResult("none"); // 이메일 변경시 확인 결과 초기화
                      }}
                      className="pl-10 h-12 rounded-2xl border-gray-200"
                    />
                  </div>
                  <Button
                    onClick={handleCheckEmail}
                    disabled={!email || isCheckingEmail}
                    className="h-12 px-6 bg-gray-600 text-white hover:bg-gray-700 rounded-2xl whitespace-nowrap"
                  >
                    {isCheckingEmail ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "확인"
                    )}
                  </Button>
                </div>
              </div>

              {/* 이메일 확인 결과 */}
              {emailCheckResult === "found" && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-2xl">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">등록된 이메일입니다!</span>
                  </div>
                </div>
              )}
              {emailCheckResult === "not-found" && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl">
                  <div className="flex items-center gap-2 text-red-700">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span className="font-medium">
                      등록되지 않은 이메일입니다.
                    </span>
                  </div>
                </div>
              )}

              <Button
                onClick={handleSendVerification}
                disabled={emailCheckResult !== "found" || isLoading}
                className="w-full h-14 bg-black text-white hover:bg-gray-800 rounded-2xl text-lg font-medium disabled:bg-gray-200 disabled:text-gray-500"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    발송 중...
                  </>
                ) : (
                  "인증코드 발송"
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: 인증코드 입력 */}
        {step === 2 && (
          <div className="bg-gray-50 rounded-3xl p-6 space-y-6">
            <div className="text-center">
              <Mail className="w-12 h-12 text-green-500 mx-auto mb-4" />
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
                  onClick={handleResendCode}
                  className="text-black hover:bg-gray-100 rounded-xl"
                >
                  인증코드 재발송
                </Button>
              </div>

              <Button
                onClick={handleVerifyCode}
                disabled={verificationCode.length !== 6 || isLoading}
                className="w-full h-14 bg-black text-white hover:bg-gray-800 rounded-2xl text-lg font-medium disabled:bg-gray-200 disabled:text-gray-500"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    확인 중...
                  </>
                ) : (
                  "인증 확인"
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: 새 비밀번호 설정 */}
        {step === 3 && (
          <div className="bg-gray-50 rounded-3xl p-6 space-y-6">
            <div className="text-center">
              <Lock className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">새 비밀번호 설정</h2>
              <p className="text-gray-600">새로운 비밀번호를 입력해주세요</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  새 비밀번호
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="8자 이상 입력하세요"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 h-12 rounded-2xl border-gray-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  비밀번호 확인
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="비밀번호를 다시 입력하세요"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 h-12 rounded-2xl border-gray-200"
                  />
                </div>
              </div>

              {/* 비밀번호 조건 안내 */}
              <div className="bg-blue-50 rounded-2xl p-3">
                <h4 className="font-medium text-blue-800 mb-2">
                  비밀번호 조건
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li
                    className={`flex items-center gap-2 ${
                      newPassword.length >= 8 ? "text-green-600" : ""
                    }`}
                  >
                    {newPassword.length >= 8 ? "✓" : "•"} 8자 이상
                  </li>
                  <li
                    className={`flex items-center gap-2 ${
                      newPassword === confirmPassword && newPassword
                        ? "text-green-600"
                        : ""
                    }`}
                  >
                    {newPassword === confirmPassword && newPassword ? "✓" : "•"}{" "}
                    비밀번호 일치
                  </li>
                </ul>
              </div>

              <Button
                onClick={handleUpdatePassword}
                disabled={
                  !newPassword ||
                  !confirmPassword ||
                  newPassword !== confirmPassword ||
                  newPassword.length < 8 ||
                  isLoading
                }
                className="w-full h-14 bg-black text-white hover:bg-gray-800 rounded-2xl text-lg font-medium disabled:bg-gray-200 disabled:text-gray-500"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    변경 중...
                  </>
                ) : (
                  "비밀번호 변경"
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: 완료 */}
        {step === 4 && (
          <div className="bg-gray-50 rounded-3xl p-6 space-y-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2 text-green-700">
                비밀번호 변경 완료!
              </h2>
              <p className="text-gray-600">
                비밀번호가 성공적으로 변경되었습니다.
                <br />
                새로운 비밀번호로 로그인해주세요.
              </p>
            </div>
            <div className="text-sm text-gray-500">
              잠시 후 로그인 페이지로 이동합니다...
            </div>

            <Link href="/login">
              <Button className="w-full h-14 bg-black text-white hover:bg-gray-800 rounded-2xl text-lg font-medium">
                로그인 페이지로 이동
              </Button>
            </Link>
          </div>
        )}

        {/* 도움말 */}
        {step <= 3 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
            <h4 className="font-medium text-blue-800 mb-2">💡 도움말</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              {step === 1 && (
                <>
                  <li>• 가입시 사용한 이메일 주소를 정확히 입력해주세요</li>
                  <li>• 대학교 이메일 또는 개인 이메일 모두 가능합니다</li>
                </>
              )}
              {step === 2 && (
                <>
                  <li>• 인증 이메일이 스팸함에 있을 수 있습니다</li>
                  <li>• 인증코드는 10분간 유효합니다</li>
                </>
              )}
              {step === 3 && (
                <>
                  <li>• 안전한 비밀번호를 설정해주세요</li>
                  <li>• 영문, 숫자, 특수문자 조합을 권장합니다</li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
