"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  User,
  Clock,
  Trophy,
  Shield,
  ShieldCheck,
  Plus,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import MypageHeader from "./components/MypageHeader";

export default function MyPage() {
  // Mock 사용자 데이터
  const [user] = useState({
    name: "김민수",
    school: "성균관대학교",
    department: "컴퓨터공학과",
    studentId: "2020",
    isVerified: false, // 대학교 인증 여부
    profileImage: null,
  });

  // Mock 기록 데이터
  const [records] = useState({
    "10KM": { time: "45:23", date: "2024-03-15", rank: 15 },
    HALF: { time: "1:35:42", date: "2024-02-20", rank: 8 },
    FULL: null, // 기록 없음
  });

  const eventNames = {
    "10KM": "10KM",
    HALF: "하프마라톤",
    FULL: "풀마라톤",
  };

  return (
    <div className="min-h-screen bg-white text-black max-w-md mx-auto">
      {/* Header */}
      <MypageHeader />

      <div className="p-4 space-y-6">
        {/* 프로필 섹션 */}
        <div className="bg-gray-50 rounded-3xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {user.profileImage ? (
                <img
                  src={user.profileImage || "/placeholder.svg"}
                  alt="프로필"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-gray-500" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-gray-600">{user.school}</p>
              <p className="text-sm text-gray-500">
                {user.department} • {user.studentId}학번
              </p>
            </div>
          </div>

          {/* 인증 상태 */}
          <div className="flex items-center justify-between p-3 bg-white rounded-2xl">
            <div className="flex items-center gap-3">
              {user.isVerified ? (
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
            {!user.isVerified && (
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
        </div>

        {/* 내 기록 섹션 */}
        <div className="bg-gray-50 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-5 h-5" />
            <h3 className="text-lg font-bold">내 기록</h3>
          </div>

          <div className="space-y-4">
            {Object.entries(eventNames).map(([key, name]) => {
              const record = records[key as keyof typeof records];
              return (
                <div
                  key={key}
                  className="bg-white rounded-2xl p-4 border border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                        <span className="font-bold text-sm">{key}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{name}</h4>
                        {record ? (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-3 h-3" />
                            <span>{record.date}</span>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">기록 없음</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {record ? (
                        <>
                          <div className="flex items-center gap-1 font-mono font-bold">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {record.time}
                          </div>
                          <div className="text-xs text-gray-500">
                            #{record.rank}위
                          </div>
                        </>
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
          {user.isVerified ? (
            <Link href="/record/new">
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
      </div>
    </div>
  );
}
