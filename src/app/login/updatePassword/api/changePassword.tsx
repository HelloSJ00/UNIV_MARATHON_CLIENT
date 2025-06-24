import axios from "@/lib/axios";

interface ChangePasswordResponse {
  status: number;
  message: string;
  data: boolean;
}

export const changePassword = async (
  email: string,
  newPassword: string
): Promise<ChangePasswordResponse> => {
  const url = `${process.env.NEXT_PUBLIC_BASE_SERVER_API_URL}/user/changePassword`;
  const body = { email, newPassword };
  console.log("[changePassword] 요청:", url, body);
  const response = await axios.patch(url, body);
  console.log("[changePassword] 응답:", response.data);
  return response.data;
};
