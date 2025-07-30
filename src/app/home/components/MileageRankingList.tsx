"use client";

import MileageRankingCard, { MileageRunner } from "./MileageRankingCard";

interface MileageRankingListProps {
  rankingsData: MileageRunner[];
  openCard: string | null;
  setOpenCard: (id: string | null) => void;
}

export default function MileageRankingList({
  rankingsData,
  openCard,
  setOpenCard,
}: MileageRankingListProps) {
  return (
    <div className="space-y-3">
      {rankingsData.map((runner) => {
        const cardId = `${runner.userId}-${runner.rank}`;
        const isOpen = openCard === cardId;

        return (
          <MileageRankingCard
            key={cardId}
            runner={runner}
            isOpen={isOpen}
            onToggle={() => setOpenCard(isOpen ? null : cardId)}
          />
        );
      })}
    </div>
  );
}
