import { useAuthStore } from "@/store/auth";
import axios from "@/lib/axios";

export interface SubmitRecordRequest {
  s3ImageUrl: string;
}

export const submitRecord = async (data: SubmitRecordRequest) => {
  const { accessToken } = useAuthStore.getState();
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_SERVER_API_URL}/recordVerification`,
    {
      s3ImageUrl: data.s3ImageUrl,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};
