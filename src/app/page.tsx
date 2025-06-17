"use client";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Timer } from "lucide-react";
import Link from "next/link";
import Header from "@/components/common/Header";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-black max-w-md mx-auto flex flex-col">
      {/* Header */}
      <Header />
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        {/* Hero Icon */}
        <div className="mb-8 mt-10">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Trophy className="w-12 h-12 text-gray-700" />
          </div>
        </div>

        {/* Main Message */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold leading-tight mb-4">
            전국 대학생들 중<br />난 얼마나 빠를까?
          </h2>
          <p className="text-gray-600 text-lg">
            대학별 마라톤 기록을 확인하고
            <br />
            나의 순위를 알아보세요
          </p>
        </div>

        {/* Feature Cards */}
        <div className="w-full space-y-4 mb-12">
          <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h3 className="font-medium">전국 대학 순위</h3>
              <p className="text-sm text-gray-600">학교별 마라톤 랭킹 확인</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <Timer className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h3 className="font-medium">개인 기록 관리</h3>
              <p className="text-sm text-gray-600">나의 마라톤 기록 등록</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3">
          <Link href="/home" className="block">
            <Button className="w-full h-14 bg-black text-white hover:bg-gray-800 rounded-2xl text-lg font-medium">
              로그인 없이 순위보러가기
            </Button>
          </Link>

          <Link href="/login" className="block">
            <Button
              variant="outline"
              className="w-full h-14 border-2 border-gray-200 hover:bg-gray-50 rounded-2xl text-lg font-medium"
            >
              로그인하고 기록 등록하기
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 text-center">
        <p className="text-xs text-gray-500">전국 대학생 마라톤 랭킹 서비스</p>
      </div>
    </div>
  );
}
