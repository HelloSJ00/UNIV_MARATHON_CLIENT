import { useAuthStore } from "@/store/auth";
import axios from "@/lib/axios";

export interface Record {
  runningType: "HALF" | "TEN_KM" | "FULL";
  marathonName: string;
  recordTime: number;
  imageUrl: string;
  createdAt: string;
  status: "VERIFIED" | "PENDING";
}

export interface RecordsResponse {
  data: Record[];
}

export const getRecords = async (): Promise<RecordsResponse> => {
  const { accessToken } = useAuthStore.getState();
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_SERVER_API_URL}/user/verifications`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};
