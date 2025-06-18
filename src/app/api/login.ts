import axios from "axios";

interface RunningRecord {
  recordTimeInSeconds: number;
  marathonName: string;
  runningType: "HALF" | "TEN_KM" | "FULL";
}

interface RunningRecords {
  HALF: RunningRecord | null;
  TEN_KM: RunningRecord | null;
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
