import axios from "@/lib/axios";
import { useAuthStore } from "@/store/auth";

// 401 인터셉터 추가 (클라이언트 환경에서만)
if (typeof window !== "undefined") {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // zustand clearAuth 호출
        const { clearAuth } = useAuthStore.getState();
        clearAuth();
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );
}

interface RunningRecord {
  id: number;
  userId: number;
  runningType: string;
  marathonName: string;
  recordTimeInSeconds: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface RunningRecords {
  TEN_KM: RunningRecord | null;
  HALF: RunningRecord | null;
  FULL: RunningRecord | null;
}

interface User {
  email: string;
  name: string;
  birthDate: string;
  gender: "MALE" | "FEMALE";
  universityName: string;
  majorName: string;
  profileImageUrl: string | null;
  role: "ROLE_USER" | "ROLE_ADMIN";
  createdAt: string;
  universityEmail: string;
  runningRecords: RunningRecords;
  universityVerified: boolean;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  tokenType: string;
  user: User;
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${process.env.NEXT_PUBLIC_BASE_SERVER_API_URL}/auth/login`,
      data,
      {
        withCredentials: true,
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("로그인 실패:", error);
    throw error;
  }
};

export default axios;
