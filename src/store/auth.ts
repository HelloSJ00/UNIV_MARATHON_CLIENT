import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface RunningRecord {
  id: number;
  userId: number;
  runningType: string;
  marathonName: string;
  recordTimeInSeconds: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface RunningRecords {
  TEN_KM: RunningRecord | null;
  HALF: RunningRecord | null;
  FULL: RunningRecord | null;
}

export interface User {
  email: string;
  name: string;
  birthDate: string;
  gender: "MALE" | "FEMALE";
  universityName: string;
  majorName: string;
  studentNumber: string | null;
  profileImageUrl: string | null;
  role: "ROLE_USER" | "ROLE_ADMIN";
  createdAt: string;
  universityEmail: string | null;
  runningRecords: RunningRecords;
  universityVerified: boolean;
  nameVisible: boolean;
  studentNumberVisible: boolean;
  majorVisible: boolean;
  graduationStatus: string;
  totalDistanceKm: number;
  totalActivityCount: number;
  avgPaceTime: number;
  stravaConnected: boolean;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setStravaConnected: () => void; // ✅ 추가
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      setStravaConnected: () =>
        set((state) => ({
          user: state.user ? { ...state.user, isStravaConnected: true } : null,
        })),
      accessToken: null,
      user: null,
      setAccessToken: (token) => set({ accessToken: token }),
      setUser: (user) => set({ user }),
      clearAuth: () => {
        set({ accessToken: null, user: null });
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth-storage");
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
