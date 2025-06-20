import axios from "@/lib/axios";
import { useAuthStore } from "@/store/auth";

export interface RecordVerification {
  userId: number;
  recordVerificationId: number;
  imageUrl: string;
  marathonName: string;
  runningType: string;
  recordTime: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface AdminRecordsResponse {
  content: RecordVerification[];
  pageable: unknown;
  last: boolean;
  totalPages: number;
  totalElements: number;
  number: number;
  sort: unknown;
  first: boolean;
  size: number;
  numberOfElements: number;
  empty: boolean;
}

export const getAdminRecords = async (): Promise<AdminRecordsResponse> => {
  const { accessToken } = useAuthStore.getState();
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_SERVER_API_URL}/admin/record-verifications`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};
