import React from "react";
import UniversitySelection from "./UniversitySelection";
import EventSelection from "./EventSelection";
import { Search } from "lucide-react";

const SearchFilterSection = () => {
  return (
    <div className="p-4">
      <div className="bg-gray-50 rounded-3xl p-6 space-y-6">
        <div className="flex items-center gap-2 text-lg font-medium">
          <Search className="w-5 h-5" />
          검색 필터
        </div>
        {/* School Selection */}
        <UniversitySelection />
        {/* Event Selection */}
        <EventSelection />
      </div>
    </div>
  );
};

export default SearchFilterSection;
