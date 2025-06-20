import axios from "@/lib/axios";
import { useAuthStore } from "@/store/auth";

export interface AdminVerifyResponse {
  status: number;
  message: string;
  data: boolean;
}

export const AdminReject = async (
  userId: number,
  recordVerificationId: number
): Promise<AdminVerifyResponse> => {
  const { accessToken } = useAuthStore.getState();
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_SERVER_API_URL}/admin/reject`,
    { userId, recordVerificationId },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};
