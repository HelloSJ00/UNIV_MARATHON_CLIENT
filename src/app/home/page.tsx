"use client";

import { useState } from "react";
import TabNavigation from "./components/TabNavigation";
import RankingSection from "./components/RankingSection";
import SearchFilterSection from "./components/SearchFilterSection";

export default function Page() {
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
    <div className="min-h-screen bg-white text-black max-w-md mx-auto">
      {/* Search Filter Section */}
      <SearchFilterSection />
      {/* Tab Navigation */}
      <TabNavigation />
      {/* Rankings Section */}
      <RankingSection />
    </div>
  );
}
