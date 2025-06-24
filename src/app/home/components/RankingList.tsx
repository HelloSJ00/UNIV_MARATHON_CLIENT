import React from "react";
import RankingCard, { type Runner } from "./RankingCard";

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
        const cardKey = `${runner.userId}-${runner.type}`;
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
