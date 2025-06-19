import { useAuthStore } from "@/store/auth";

export interface UpdateUserRequest {
  name: string;
  birthDate: string;
  gender: "MALE" | "FEMALE";
  universityName: string;
  majorName: string;
  universityEmail: string;
  profileImageUrl: string | null;
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
    profileImageUrl: string | null;
    role: string;
    createdAt: string;
    universityEmail: string;
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
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_SERVER_API_URL}/user/update-user-info`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) {
    throw new Error("유저 정보 업데이트에 실패했습니다.");
  }
  return response.json();
};
