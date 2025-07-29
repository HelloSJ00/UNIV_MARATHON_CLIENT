"use client";
import CommonHeader from "../../components/common/CommonHeader";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import ProfileSection from "./components/ProfileSection";
import RecordSection from "./components/RecordSection";
import RegisterRecordButton from "./components/RegisterRecordButton";
import LogoutButton from "./components/LogoutButton";
import StravaConnect from "./components/StravaConnect";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function MyPageContent() {
  const searchParams = useSearchParams();
  const setStravaConnected = useAuthStore((state) => state.setStravaConnected);

  useEffect(() => {
    const stravaStatus = searchParams.get("strava");
    if (stravaStatus === "success") {
      setStravaConnected();
    }
  }, [searchParams, setStravaConnected]);

  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  if (!user) {
    console.log(user);
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black max-w-md mx-auto">
      {/* Header */}
      <CommonHeader text={"내 정보"} />

      <div className="p-4 space-y-6">
        <ProfileSection user={user} />
        <RecordSection user={user} />
        {user.universityVerified && <StravaConnect />}
        <RegisterRecordButton universityVerified={user.universityVerified} />
        <LogoutButton onLogout={handleLogout} />
      </div>
    </div>
  );
}

export default function MyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          로딩중...
        </div>
      }
    >
      <MyPageContent />
    </Suspense>
  );
}
