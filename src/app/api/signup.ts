import axios from "axios";

interface SignupRequest {
  email: string;
  password: string;
  name: string;
  birthDate: string;
  gender: "MALE" | "FEMALE";
  university: string;
  studentId: string;
  major: string;
  profileImage: string | null;
}

interface SignupResponse {
  status: number;
  message: string;
  data: {
    id: number;
    email: string;
    name: string;
  };
}

export const signup = async (data: SignupRequest) => {
  try {
    const response = await axios.post<SignupResponse>(
      `${process.env.NEXT_PUBLIC_BASE_SERVER_API_URLL}/auth/signup`,
      data,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("회원가입 실패:", error);
    throw error;
  }
};
