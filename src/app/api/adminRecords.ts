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

export interface AdminVerifyResponse {
  userId: number;
  recordVerificationId: number;
}

export const AdminConfirm = async (
  userId: number,
  recordVerificationId: number
): Promise<AdminVerifyResponse> => {
  const { accessToken } = useAuthStore.getState();
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_SERVER_API_URL}/admin/confirm`,
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
