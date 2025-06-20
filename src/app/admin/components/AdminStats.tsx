import React from "react";
import { Badge } from "@/components/ui/badge";

interface AdminStatsProps {
  count: number;
}

const AdminStats = ({ count }: AdminStatsProps) => (
  <div className="p-4 bg-gray-50">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="font-medium">검토 대기중</span>
      </div>
      <Badge variant="secondary" className="bg-orange-100 text-orange-700">
        {count}건
      </Badge>
    </div>
  </div>
);

export default AdminStats;
