import { useAuthStore } from "@/store/auth";

interface EmailVerificationResponse {
  status: number;
  message: string;
  data: boolean;
}

// 이메일 인증 요청
export const verifyEmail = async (
  email: string
): Promise<EmailVerificationResponse> => {
  const { accessToken } = useAuthStore.getState();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_SERVER_API_URL}/emailVerification?email=${email}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("이메일 인증 요청에 실패했습니다.");
  }

  return response.json();
};

// 이메일 인증 메일 발송
export const sendVerificationEmail = async (
  email: string
): Promise<EmailVerificationResponse> => {
  const { accessToken } = useAuthStore.getState();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_SERVER_API_URL}/emailVerification/sendMail?univEmail=${email}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("이메일 인증 메일 발송에 실패했습니다.");
  }

  return response.json();
};

// 인증코드 확인
export const verifyCode = async (
  email: string,
  code: string
): Promise<EmailVerificationResponse> => {
  const { accessToken } = useAuthStore.getState();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_SERVER_API_URL}/emailVerification/verifyCode?univEmail=${email}&verifyCode=${code}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("인증코드 확인에 실패했습니다.");
  }

  return response.json();
};
