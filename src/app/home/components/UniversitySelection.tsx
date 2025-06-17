import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const UniversitySelection = () => {
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

  const filteredSchools = schools.filter((school) =>
    school.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">학교 선택</label>
      <Select value={selectedSchool} onValueChange={setSelectedSchool}>
        <SelectTrigger className="w-full h-12 rounded-2xl border-gray-200 bg-white">
          <SelectValue placeholder="학교를 선택하세요" />
        </SelectTrigger>
        <SelectContent className="rounded-2xl">
          <div className="p-2">
            <Input
              placeholder="학교명 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-2 rounded-xl border-gray-200"
            />
          </div>
          {filteredSchools.map((school) => (
            <SelectItem key={school} value={school} className="rounded-xl">
              {school}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default UniversitySelection;
