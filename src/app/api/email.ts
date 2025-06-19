import { useAuthStore } from "@/store/auth";
import axios from "@/lib/axios";

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
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_SERVER_API_URL}/emailVerification?email=${email}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

// 이메일 인증 메일 발송
export const sendVerificationEmail = async (
  email: string
): Promise<EmailVerificationResponse> => {
  const { accessToken } = useAuthStore.getState();
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_SERVER_API_URL}/emailVerification/sendMail?univEmail=${email}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

// 인증코드 확인
export const verifyCode = async (
  email: string,
  code: string
): Promise<EmailVerificationResponse> => {
  const { accessToken } = useAuthStore.getState();
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_SERVER_API_URL}/emailVerification/verifyCode?univEmail=${email}&verifyCode=${code}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};
