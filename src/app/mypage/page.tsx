"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { User, Clock, Trophy, Shield, ShieldCheck, Plus } from "lucide-react";
import Link from "next/link";
import CommonHeader from "./components/CommonHeader";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { getAgeFromBirthDate } from "@/utils/date";

export default function MyPage() {
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

  const eventNames = {
    TEN_KM: "10KM",
    HALF: "HALF",
    FULL: "FULL",
  };

  return (
    <div className="min-h-screen bg-white text-black max-w-md mx-auto">
      {/* Header */}
      <CommonHeader text={"내 정보"} />

      <div className="p-4 space-y-6">
        {/* 프로필 섹션 */}
        <div className="bg-gray-50 rounded-3xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {user.profileImageUrl ? (
                <Image
                  src={user.profileImageUrl}
                  alt="프로필"
                  width={100} // 예시: 이미지의 예상 너비 (픽셀)
                  height={100} // 예시: 이미지의 예상 높이 (픽셀)
                  className="w-full h-full object-cover" // Tailwind CSS 클래스는 그대로 사용 가능
                  // priority // LCP에 중요한 이미지라면 추가 (선택 사항)
                />
              ) : (
                <User className="w-8 h-8 text-gray-500" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-gray-600">{user.universityName}</p>
              <p className="text-sm text-gray-500">
                {user.majorName} • {user.universityEmail}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500">
                  {user.gender === "MALE" ? "남성" : "여성"} ·{" "}
                  {getAgeFromBirthDate(user.birthDate)}세
                </span>
              </div>
            </div>
          </div>

          {/* 인증 상태 */}
          <div className="flex items-center justify-between p-3 bg-white rounded-2xl">
            <div className="flex items-center gap-3">
              {user.universityVerified ? (
                <>
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-green-700">
                    대학교 인증 완료
                  </span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 text-red-500" />
                  <span className="font-medium text-red-700">
                    미인증 사용자
                  </span>
                </>
              )}
            </div>
            {!user.universityVerified && (
              <Link href="/mypage/emailVerification">
                <Button
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 text-white rounded-xl px-4"
                >
                  이메일 인증하기
                </Button>
              </Link>
            )}
          </div>
          {/* 내 정보 수정 버튼 */}
          <Link href="/mypage/edit">
            <Button
              variant="outline"
              className="w-full mt-3 h-12 border-gray-200 hover:bg-gray-50 rounded-2xl font-medium flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />내 정보 수정
            </Button>
          </Link>
          {user.role === "ROLE_ADMIN" && (
            <Link href="/admin">
              <Button
                variant="destructive"
                className="w-full mt-3 h-12 rounded-2xl font-medium flex items-center justify-center gap-2"
              >
                <Trophy className="w-4 h-4" />
                관리자 페이지
              </Button>
            </Link>
          )}
        </div>
        {/* 내 기록 섹션 */}
        <div className="bg-gray-50 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-5 h-5" />
            <h3 className="text-lg font-bold">내 기록</h3>
          </div>

          <div className="space-y-4">
            {Object.entries(eventNames).map(([key, name]) => {
              const record =
                user.runningRecords?.[
                  key as keyof typeof user.runningRecords
                ] || null;
              return (
                <div
                  key={key}
                  className="bg-white rounded-2xl p-4 border border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                        <span className="font-bold text-sm">
                          {key === "TEN_KM" ? "10KM" : key}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium">{name}</h4>
                        {record ? (
                          <div className="text-sm text-gray-600">
                            {record.marathonName}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">기록 없음</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {record ? (
                        <div className="flex items-center gap-1 font-mono font-bold">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {Math.floor(record.recordTimeInSeconds / 3600)
                            .toString()
                            .padStart(2, "0")}
                          :
                          {Math.floor((record.recordTimeInSeconds % 3600) / 60)
                            .toString()
                            .padStart(2, "0")}
                          :
                          {(record.recordTimeInSeconds % 60)
                            .toString()
                            .padStart(2, "0")}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 기록 등록 버튼 */}
        <div className="pb-6">
          {user.universityVerified ? (
            <Link href="/mypage/myrecord">
              <Button className="w-full h-14 bg-black text-white hover:bg-gray-800 rounded-2xl text-lg font-medium flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />내 기록 등록하기
              </Button>
            </Link>
          ) : (
            <div className="space-y-3">
              <Button
                disabled
                className="w-full h-14 bg-gray-200 text-gray-500 rounded-2xl text-lg font-medium cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />내 기록 등록하기
              </Button>
              <p className="text-center text-sm text-red-600">
                ⚠️ 기록 등록은 대학교 인증 후 가능합니다
              </p>
            </div>
          )}
        </div>

        {/* 로그아웃 버튼 */}
        <div className="mt-4">
          <button
            onClick={handleLogout}
            className="w-full py-4 text-red-600 font-medium text-center border border-red-600 rounded-2xl hover:bg-red-50 transition-colors"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
