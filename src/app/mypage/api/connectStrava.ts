import { useAuthStore } from "@/store/auth";
import axios from "@/lib/axios";

export const connectStrava = async () => {
  try {
    const { accessToken } = useAuthStore.getState();

    // API 호출로 변경
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_SERVER_API_URL}/auth/strava/connect`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // axios는 성공 시 자동으로 response.data에 접근
    const data = response.data;
    // 스트라바 OAuth URL로 리다이렉트
    window.location.href = data.redirectUrl;
  } catch (error) {
    console.error("스트라바 연동 실패", error);
    throw error;
  }
};
