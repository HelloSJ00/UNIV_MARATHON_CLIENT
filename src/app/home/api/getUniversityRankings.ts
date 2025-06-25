import axios from "@/lib/axios";

export interface UniversityRanking {
  ranking: number;
  universityName: string;
  universityImage: string | null;
  finisherCount: number;
}

export async function getUniversityRankings(
  runningType: "TEN_KM" | "HALF" | "FULL"
): Promise<UniversityRanking[]> {
  const params = { runningType };
  const searchParams = new URLSearchParams(params);

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_SERVER_API_URL}/rankings/universities/finisher?${searchParams}`
  );
  return response.data.data;
}
