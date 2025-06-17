import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EventSelection = () => {
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
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">종목 선택</label>
      <Select value={selectedEvent} onValueChange={setSelectedEvent}>
        <SelectTrigger className="w-full h-12 rounded-2xl border-gray-200 bg-white">
          <SelectValue placeholder="종목을 선택하세요" />
        </SelectTrigger>
        <SelectContent className="rounded-2xl">
          {events.map((event) => (
            <SelectItem key={event} value={event} className="rounded-xl">
              {event}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default EventSelection;
