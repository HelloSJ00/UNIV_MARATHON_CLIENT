import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const SignupHeader = () => {
  return (
    <div className="flex items-center p-4 relative">
      <Link href="/">
        <Button
          variant="ghost"
          size="sm"
          className="p-2 hover:bg-gray-50 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </Link>
      <h1 className="text-xl font-bold absolute left-1/2 -translate-x-1/2">
        회원가입
      </h1>
    </div>
  );
};

export default SignupHeader;
