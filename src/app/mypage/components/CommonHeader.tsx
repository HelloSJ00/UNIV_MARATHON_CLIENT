import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface CommonHeaderProps {
  text: string;
}

const CommonHeader = ({ text }: CommonHeaderProps) => {
  const router = useRouter();

  return (
    <div className="flex items-center p-4 relative">
      <Button
        variant="ghost"
        size="sm"
        className="p-2 hover:bg-gray-50 rounded-full"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>
      <h1 className="text-xl font-bold absolute left-1/2 -translate-x-1/2">
        {text}
      </h1>
    </div>
  );
};

export default CommonHeader;
