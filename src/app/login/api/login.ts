import axios from "@/lib/axios";
import type { User } from "@/store/auth";

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
    return response.data;
  } catch (error) {
    console.error("로그인 실패:", error);
    throw error;
  }
};
