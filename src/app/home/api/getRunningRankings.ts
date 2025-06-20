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

export interface RunningRankResponse {
  data: RunningRank[];
}

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
  return response.data;
}
