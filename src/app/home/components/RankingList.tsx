import React from "react";
import RankingCard from "./RankingCard";

interface Runner {
  user: {
    id: string;
    name: string;
    gender: "MALE" | "FEMALE";
    universityName: string;
    majorName?: string;
    studentNumber?: string;
    profileImageUrl?: string;
  };
  type: "TEN_KM" | "HALF" | "FULL";
  rank: number;
  recordTimeInSeconds: number;
}

interface RankingListProps {
  rankingsData: Runner[];
  openCard: string | null;
  setOpenCard: (v: string | null) => void;
  isIntegratedRanking: boolean;
  formatTime: (seconds: number) => string;
  formatPace: (seconds: number, type: "TEN_KM" | "HALF" | "FULL") => string;
}

export default function RankingList({
  rankingsData,
  openCard,
  setOpenCard,
  isIntegratedRanking,
  formatTime,
  formatPace,
}: RankingListProps) {
  return (
    <div className="space-y-3">
      {rankingsData.map((runner) => {
        const cardKey = `${runner.user.id}-${runner.type}`;
        const isOpen = openCard === cardKey;
        return (
          <RankingCard
            key={cardKey}
            runner={runner}
            isOpen={isOpen}
            onClick={() => setOpenCard(isOpen ? null : cardKey)}
            isIntegratedRanking={isIntegratedRanking}
            formatTime={formatTime}
            formatPace={formatPace}
          />
        );
      })}
    </div>
  );
}
