import axios from "axios";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  tokenType: string;
}

export const login = async (data: LoginRequest) => {
  try {
    const response = await axios.post<LoginResponse>(
      `${process.env.NEXT_PUBLIC_BASE_SERVER_API_URLL}/auth/login`,
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
