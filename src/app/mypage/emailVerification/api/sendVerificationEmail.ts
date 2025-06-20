import { useAuthStore } from "@/store/auth";
import axios from "@/lib/axios";

interface EmailVerificationResponse {
  status: number;
  message: string;
  data: boolean;
}

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
