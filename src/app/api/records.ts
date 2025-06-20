import { useAuthStore } from "@/store/auth";
import axios from "@/lib/axios";

interface Record {
  runningType: "HALF" | "TEN_KM" | "FULL";
  marathonName: string;
  recordTime: number;
  imageUrl: string;
  createdAt: string;
  status: "VERIFIED" | "PENDING";
}

interface RecordsResponse {
  status: number;
  message: string;
  data: Record[];
}

interface SubmitRecordRequest {
  s3ImageUrl: string;
}

interface PresignedUrlResponse {
  presignedUrl: string;
  fileUrl: string;
}

export interface RunningRankUser {
  id: number;
  name: string;
  email: string;
  gender: "MALE" | "FEMALE";
  universityName: string;
  majorName: string;
  studentNumber: string | null;
  profileImageUrl: string | null;
}

export interface RunningRank {
  rank: number;
  type: "TEN_KM" | "HALF" | "FULL";
  marathonName: string;
  recordTimeInSeconds: number;
  recordDate: string | null;
  user: RunningRankUser;
}

export interface RunningRankResponse {
  status: number;
  message: string;
  data: RunningRank[];
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

// PresignedUrl 서버로 부터 받아오기
export const getPresignedUrl = async (
  file: File
): Promise<PresignedUrlResponse> => {
  console.log("getPresignedUrl - 요청 시작:", {
    fileName: file.name,
    fileType: file.type,
  });
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_SERVER_API_URL}/user/upload-url`,
    {
      fileName: file.name,
      fileType: file.type,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  console.log("getPresignedUrl - 응답 성공:", response.data);
  return response.data;
};

// 기록증 업로드 uri 서버로 전송
export const submitRecord = async (data: SubmitRecordRequest) => {
  const { accessToken } = useAuthStore.getState();
  console.log("submitRecord - 요청 시작:", data);
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
  console.log("submitRecord - 응답 성공:", response.data);
  return response.data;
};

export async function getRunningRankings(
  runningType: "TEN_KM" | "HALF" | "FULL",
  universityName?: string,
  gender?: string
): Promise<RunningRankResponse> {
  const params = new URLSearchParams({
    runningType,
    ...(universityName && { universityName }),
    ...(gender && { gender }),
  });
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_SERVER_API_URL}/runningRecord/school-ranking?${params}`
  );
  console.log(response.data); // ✅ 출력
  return response.data; // ✅ 반환
}
