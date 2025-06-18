import { useAuthStore } from "@/store/auth";

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

interface PresignedUrlRequest {
  fileName: string;
  fileType: string;
}

interface PresignedUrlResponse {
  presignedUrl: string;
}

export interface RunningRankUser {
  id: number;
  name: string;
  email: string;
  gender: "MALE" | "FEMALE";
  universityName: string;
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

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_SERVER_API_URL}/user/verifications`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("기록 조회에 실패했습니다.");
  }

  return response.json();
};

// PresignedUrl 서버로 부터 받아오기
export const getPresignedUrl = async (
  file: File
): Promise<PresignedUrlResponse> => {
  const { accessToken } = useAuthStore.getState();

  console.log("getPresignedUrl - 요청 시작:", {
    fileName: file.name,
    fileType: file.type,
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_SERVER_API_URL}/user/upload-url`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
      } as PresignedUrlRequest),
    }
  );

  if (!response.ok) {
    console.error("getPresignedUrl - 서버 응답 실패:", {
      status: response.status,
      statusText: response.statusText,
    });
    throw new Error("Presigned URL을 받아오는데 실패했습니다.");
  }

  const data = await response.json();
  console.log("getPresignedUrl - 응답 성공:", data);
  return data;
};

// 기록증 업로드 uri 서버로 전송
export const submitRecord = async (data: SubmitRecordRequest) => {
  const { accessToken } = useAuthStore.getState();

  console.log("submitRecord - 요청 시작:", data);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_SERVER_API_URL}/recordVerification`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        s3ImageUrl: data.s3ImageUrl,
      }),
    }
  );

  if (!response.ok) {
    console.error("submitRecord - 서버 응답 실패:", {
      status: response.status,
      statusText: response.statusText,
    });
    throw new Error("기록 제출에 실패했습니다.");
  }

  const responseData = await response.json();
  console.log("submitRecord - 응답 성공:", responseData);
  return responseData;
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

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_SERVER_API_URL}/runningRecord/school-ranking?${params}`,
    {
      headers: {
        Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("랭킹 조회에 실패했습니다.");
  }
  const data = await response.json();
  console.log(data); // ✅ 출력
  return data; // ✅ 반환
}
