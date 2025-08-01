import { useAuthStore } from "@/store/auth";
import axios from "@/lib/axios";

export interface SubmitRecordRequest {
  s3ImageUrl: string;
}

export const submitRecord = async (data: SubmitRecordRequest) => {
  const { accessToken } = useAuthStore.getState();
  try {
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
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { status?: number; data?: { message?: string } };
      };
      if (axiosError.response?.status === 429) {
        // ❌ alert 제거
        // ✅ 예외 메시지 포함하여 다시 throw
        throw new Error(
          axiosError.response?.data?.message ||
            "이번 달 호출 횟수를 모두 사용했습니다."
        );
      }
    }

    console.error("예상치 못한 오류:", error);
    throw new Error("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
  }
};
