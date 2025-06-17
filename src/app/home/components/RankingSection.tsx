import React, { useState } from "react";
import { Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const RankingSection = () => {
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [activeTab, setActiveTab] = useState("individual");
  const [searchQuery, setSearchQuery] = useState("");

  const schools = [
    "성균관대학교",
    "한양대학교",
    "연세대학교",
    "고려대학교",
    "서울대학교",
    "중앙대학교",
    "경희대학교",
    "이화여자대학교",
  ];

  const events = ["TEN_KM", "HALF", "FULL"];

  const mockRankings = [
    { rank: 1, name: "김민수", school: "성균관대학교", time: "2:45:23" },
    { rank: 2, name: "이준호", school: "한양대학교", time: "2:47:15" },
    { rank: 3, name: "박서연", school: "연세대학교", time: "2:48:42" },
    { rank: 4, name: "정다은", school: "고려대학교", time: "2:49:18" },
    { rank: 5, name: "최동현", school: "한양대학교", time: "2:50:41" },
    { rank: 6, name: "강지우", school: "서울대학교", time: "2:52:07" },
    { rank: 7, name: "윤하늘", school: "중앙대학교", time: "2:53:29" },
    { rank: 8, name: "임소영", school: "경희대학교", time: "2:54:15" },
  ];
  return (
    <div className="px-4 pb-6">
      <div className="bg-gray-50 rounded-3xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5" />
          <h2 className="text-lg font-bold">
            {activeTab === "individual" ? "개인 랭킹" : "학교 통합 랭킹"}
          </h2>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          총 100명의 랭킹을 확인할 수 있습니다
        </p>

        {selectedSchool && (
          <div className="mb-4 p-3 bg-white rounded-2xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">🏫</span>
              </div>
              <span className="font-medium">{selectedSchool}</span>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {mockRankings.slice(0, 8).map((runner) => (
            <div
              key={runner.rank}
              className="bg-white rounded-2xl p-4 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold">
                    {runner.rank}
                  </div>
                  <div>
                    <div className="font-medium">{runner.name}</div>
                    <div className="text-sm text-gray-600">{runner.school}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm font-mono">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {runner.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            className="text-gray-600 hover:text-black rounded-full"
          >
            더 보기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RankingSection;
