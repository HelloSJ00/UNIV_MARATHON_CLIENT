import axios from "axios";

interface MajorResponse {
  status: number;
  message: string;
  data: string[];
}

export const getMajorOfUniversity = async (university: string) => {
  try {
    const response = await axios.get<MajorResponse>(
      `${process.env.NEXT_PUBLIC_BASE_SERVER_API_URL}/auth/university/major?universityName=${university}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("전공 목록 조회 실패:", error);
    throw error;
  }
};
