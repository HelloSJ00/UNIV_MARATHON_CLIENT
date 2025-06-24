import { useAuthStore } from "@/store/auth";
import axios from "@/lib/axios";

export interface UpdateUserRequest {
  name: string;
  birthDate: string;
  gender: "MALE" | "FEMALE";
  studentNumber: string;
  universityName: string;
  majorName: string;
  universityEmail: string;
  profileImageUrl: string | null;
  isNameVisible: boolean;
  isStudentNumberVisible: boolean;
  isMajorVisible: boolean;
  graduationStatus: string;
}

export interface RunningRecord {
  recordTimeInSeconds: number;
  marathonName: string;
  runningType: "HALF" | "TEN_KM" | "FULL";
}

export interface UpdateUserResponse {
  status: number;
  message: string;
  data: {
    email: string;
    name: string;
    birthDate: string;
    age: number;
    gender: "MALE" | "FEMALE";
    universityName: string;
    majorName: string;
    studentNumber: string | null;
    profileImageUrl: string | null;
    role: string;
    createdAt: string;
    universityEmail: string;
    isNameVisible: boolean;
    isStundentNumberVisible: boolean;
    isMajorVisible: boolean;
    graduationStatus: string;
    runningRecords: {
      HALF: RunningRecord | null;
      TEN_KM: RunningRecord | null;
      FULL: RunningRecord | null;
    };
    universityVerified: boolean;
  };
}

export const updateUser = async (
  data: UpdateUserRequest
): Promise<UpdateUserResponse> => {
  const { accessToken } = useAuthStore.getState();
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_BASE_SERVER_API_URL}/user/update-user-info`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};
