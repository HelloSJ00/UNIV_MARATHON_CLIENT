import React from "react";
import { Button } from "@/components/ui/button";
import { User, RefreshCw } from "lucide-react";

interface AdminHeaderProps {
  onRefresh: () => void;
}

const AdminHeader = ({ onRefresh }: AdminHeaderProps) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-red-50">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
        <User className="w-4 h-4 text-white" />
      </div>
      <div>
        <h1 className="text-xl font-bold">관리자</h1>
        <p className="text-sm text-red-600">기록 검토 시스템</p>
      </div>
    </div>
    <Button
      onClick={onRefresh}
      variant="ghost"
      size="sm"
      className="text-red-600 hover:bg-red-100 rounded-full p-2"
    >
      <RefreshCw className="w-5 h-5" />
    </Button>
  </div>
);

export default AdminHeader;
