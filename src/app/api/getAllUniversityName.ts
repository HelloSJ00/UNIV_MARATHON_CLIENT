import axios from "@/lib/axios";

interface UniversitiesResponse {
  status: number;
  message: string;
  data: string[];
}

export const getAllUniversityName = async () => {
  try {
    const response = await axios.get<UniversitiesResponse>(
      `${process.env.NEXT_PUBLIC_BASE_SERVER_API_URL}/auth/university/all`
    );
    return response.data;
  } catch (error) {
    console.error("대학교 목록 조회 실패:", error);
    throw error;
  }
};
