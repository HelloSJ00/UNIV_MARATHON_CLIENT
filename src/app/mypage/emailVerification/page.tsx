"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyEmail } from "./api/verifyEmail";
import { sendVerificationEmail } from "./api/sendVerificationEmail";
import { verifyCode } from "./api/verifyCode";
import { useAuthStore } from "@/store/auth";
import EmailVerificationHeader from "./components/EmailVerificationHeader";
import EmailVerificationProgress from "./components/EmailVerificationProgress";
import EmailStep1 from "./components/EmailStep1";
import EmailStep2 from "./components/EmailStep2";
import EmailStep3 from "./components/EmailStep3";
import EmailVerificationHelp from "./components/EmailVerificationHelp";

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
      if (response.status === 200 && response.data === true) {
        setIsEmailValid(true);
        alert(response.message);
      } else {
        setIsEmailValid(false);
        alert("올바른 대학교 이메일이 아닙니다.");
      }
    } catch {
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
      if (response.status === 200 && response.data === true) {
        setStep(2);
        alert(response.message);
      } else {
        alert("이메일 인증 발송에 실패했습니다.");
      }
    } catch {
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
      if (response.status === 200 && response.data === true) {
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
    } catch {
      alert("인증코드 확인에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black max-w-md mx-auto">
      <EmailVerificationHeader />
      <div className="p-4">
        <EmailVerificationProgress step={step} />
        {step === 1 && (
          <EmailStep1
            email={email}
            setEmail={setEmail}
            isEmailValid={isEmailValid}
            isCheckingEmail={isCheckingEmail}
            isSendingEmail={isSendingEmail}
            handleCheckEmail={handleCheckEmail}
            handleSendVerification={handleSendVerification}
          />
        )}
        {step === 2 && (
          <EmailStep2
            email={email}
            verificationCode={verificationCode}
            setVerificationCode={setVerificationCode}
            isVerifying={isVerifying}
            handleVerifyCode={handleVerifyCode}
            handleSendVerification={handleSendVerification}
          />
        )}
        {step === 3 && <EmailStep3 />}
        <EmailVerificationHelp step={step} />
      </div>
    </div>
  );
}
