import axios from "@/lib/axios";
export interface RunningRank {
  rank: number;
  type: "TEN_KM" | "HALF" | "FULL";
  marathonName: string;
  recordTimeInSeconds: number;
  recordDate: string | null;
  userId: number;
  name: string;
  email: string;
  gender: "MALE" | "FEMALE";
  universityName: string;
  majorName: string;
  studentNumber: string | null;
  profileImageUrl: string | null;
  nameVisible: boolean;
  studentNumberVisible: boolean;
  majorVisible: boolean;
  graduationStatus?: string;
}

export interface MyRecord extends RunningRank {
  totalCount: number;
  ranking: number;
  isInTop10: boolean;
}

export interface RunningRankResponse {
  rankings: RunningRank[];
  myrecord: MyRecord | null;
}

export async function getRunningRankings(
  runningType: "TEN_KM" | "HALF" | "FULL",
  gender: "MALE" | "FEMALE" | "ALL",
  universityName?: string,
  accessToken?: string,
  graduationStatus?: "ENROLLED" | "GRADUATED" | "ALL"
): Promise<RunningRankResponse> {
  console.log("[API 요청 파라미터]", {
    runningType,
    gender,
    universityName,
    graduationStatus,
  });

  const params: Record<string, string> = {
    runningType,
    gender,
  };
  if (universityName) params.universityName = universityName;
  if (graduationStatus) params.graduationStatus = graduationStatus;

  const searchParams = new URLSearchParams(params);

  const headers: { [key: string]: string } = {};
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  console.log("[API 요청 URL과 설정]", {
    url: `${process.env.NEXT_PUBLIC_BASE_SERVER_API_URL}/runningRecord/school-ranking`,
    params: Object.fromEntries(searchParams),
    headers,
  });

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_SERVER_API_URL}/runningRecord/school-ranking?${searchParams}`,
    { headers }
  );
  console.log("[API 응답]", response.data);
  return response.data.data;
}
