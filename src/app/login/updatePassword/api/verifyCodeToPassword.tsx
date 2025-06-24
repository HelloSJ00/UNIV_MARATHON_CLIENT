import axios from "@/lib/axios";

interface EmailVerificationResponse {
  status: number;
  message: string;
  data: boolean;
}

export const verifyCodeToPassword = async (
  email: string,
  code: string
): Promise<EmailVerificationResponse> => {
  const url = `${process.env.NEXT_PUBLIC_BASE_SERVER_API_URL}/user/verifyCode?univEmail=${email}&verifyCode=${code}`;
  console.log("[verifyCodeToPassword] 요청 URL:", url);
  const response = await axios.get(url);
  console.log("[verifyCodeToPassword] 응답:", response.data);
  return response.data;
};
