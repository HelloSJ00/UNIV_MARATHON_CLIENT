import axios from "@/lib/axios";

interface EmailVerificationResponse {
  status: number;
  message: string;
  data: boolean;
}

export const sendEmailVerificationForPassword = async (
  email: string
): Promise<EmailVerificationResponse> => {
  const url = `${process.env.NEXT_PUBLIC_BASE_SERVER_API_URL}/user/sendMail?univEmail=${email}`;
  console.log("[sendEmailVerificationForPassword] 요청 URL:", url);
  const response = await axios.get(url);
  console.log("[sendEmailVerificationForPassword] 응답:", response.data);
  return response.data;
};
