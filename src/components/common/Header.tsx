"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Trophy } from "lucide-react";

export default function Header() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100">
      <div className="flex items-center gap-2">
        <Trophy className="w-6 h-6" />
        <h1 className="text-xl font-bold">Univ Marathon Ranking</h1>
      </div>
      <Button
        variant="ghost"
        className="text-black hover:bg-gray-50 rounded-full px-4"
        onClick={() => router.push("/login")}
      >
        로그인
      </Button>
    </div>
  );
}
