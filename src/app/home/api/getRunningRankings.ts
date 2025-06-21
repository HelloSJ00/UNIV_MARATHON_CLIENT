import axios from "@/lib/axios";

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

export interface MyRecord extends RunningRank {
  totalCount: number;
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
  accessToken?: string
): Promise<RunningRankResponse> {
  const params = new URLSearchParams({
    runningType,
    gender,
    ...(universityName && { universityName }),
  });

  const headers: { [key: string]: string } = {};
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_SERVER_API_URL}/runningRecord/school-ranking?${params}`,
    { headers }
  );
  console.log("API 응답:", response.data);
  console.log("반환될 데이터:", response.data.data);
  return response.data.data;
}
