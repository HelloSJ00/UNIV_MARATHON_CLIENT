import Image from "next/image";
import { Button } from "@/components/ui/button";
import { User as LucideUser, Trophy, Shield, ShieldCheck } from "lucide-react";
import Link from "next/link";
import React from "react";
import { getAgeFromBirthDate } from "@/utils/date";
import { User } from "@/store/auth";

interface ProfileSectionProps {
  user: User;
}

export default function ProfileSection({ user }: ProfileSectionProps) {
  return (
    <div className="bg-gray-50 rounded-3xl p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
          {user.profileImageUrl ? (
            <Image
              src={user.profileImageUrl}
              alt="프로필"
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          ) : (
            <LucideUser className="w-8 h-8 text-gray-500" />
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
              <span className="font-medium text-red-700">미인증 사용자</span>
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
          <LucideUser className="w-4 h-4" />내 정보 수정
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
  );
}
