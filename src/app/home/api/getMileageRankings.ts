import axios from "@/lib/axios";

export interface MileageRunner {
  userId: number;
  name: string;
  gender: "MALE" | "FEMALE";
  universityName: string;
  studentNumber: string | null;
  profileImageUrl: string | null;
  majorName: string;
  graduationStatus: "ENROLLED" | "GRADUATED";
  totalDistanceKm: number;
  totalActivityCount: number;
  avgPaceTime: number;
  rank: number;
  nameVisible: boolean;
  studentNumberVisible: boolean;
  majorVisible: boolean;
}

export interface MyMileageRecord extends MileageRunner {
  totalCount: number;
  ranking: number;
  isInTop10: boolean;
}

export interface MileageRankResponse {
  rankings: MileageRunner[];
  myrecord: MyMileageRecord | null;
}

export async function getMileageRankings(
  gender: "MALE" | "FEMALE" | "ALL",
  universityName?: string,
  accessToken?: string,
  graduationStatus?: "ENROLLED" | "GRADUATED" | "ALL"
): Promise<MileageRankResponse> {
  console.log("[API 요청 파라미터]", {
    gender,
    universityName,
    graduationStatus,
  });

  const params: Record<string, string> = {
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
    url: `${process.env.NEXT_PUBLIC_BASE_SERVER_API_URL}/mileage/mileage-ranking`,
    params: Object.fromEntries(searchParams),
    headers,
  });

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_SERVER_API_URL}/mileage/mileage-ranking?${searchParams}`,
    { headers }
  );
  console.log("[API 응답]", response.data);
  return response.data.data;
}
