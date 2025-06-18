"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Trophy, User } from "lucide-react";
import { useAuthStore } from "@/store/auth";

export default function Header() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100">
      <div className="flex items-center gap-2">
        <Trophy className="w-6 h-6" />
        <h1 className="text-xl font-bold">Univ Marathon Ranking</h1>
      </div>
      {accessToken ? (
        <Button
          variant="ghost"
          className="text-black hover:bg-gray-50 rounded-full px-4"
          onClick={() => router.push("/mypage")}
        >
          <User className="w-4 h-4 mr-2" />
          내정보
        </Button>
      ) : (
        <Button
          variant="ghost"
          className="text-black hover:bg-gray-50 rounded-full px-4"
          onClick={() => router.push("/login")}
        >
          로그인
        </Button>
      )}
    </div>
  );
}
