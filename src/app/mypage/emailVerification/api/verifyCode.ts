import { useAuthStore } from "@/store/auth";
import axios from "@/lib/axios";

interface EmailVerificationResponse {
  status: number;
  message: string;
  data: boolean;
}

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
