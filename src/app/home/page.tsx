"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import {
  getRunningRankings,
  type RunningRank,
  type MyRecord,
} from "./api/getRunningRankings";
import { getAllUniversityName } from "@/app/api/common/getAllUniversityName";
import {
  getUniversityRankings,
  type UniversityRanking,
} from "./api/getUniversityRankings";
import { getMileageRankings } from "./api/getMileageRankings";
import { type MyMileageRecord } from "./api/getMileageRankings";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import PersonalRecordSection from "./components/PersonalRecordSection";
import PersonalMileageSection from "./components/PersonalMileageSection";
import UniversityRankingSection from "./components/UniversityRankingSection";
import { type MileageRunner as MileageRanking } from "./components/MileageRankingCard";

function HomePageContent() {
  const searchParams = useSearchParams();
  const setStravaConnected = useAuthStore((state) => state.setStravaConnected);

  useEffect(() => {
    const stravaStatus = searchParams.get("strava");
    if (stravaStatus === "success") {
      setStravaConnected();
    }
  }, [searchParams, setStravaConnected]);

  // 공통 상태
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<
    "TEN_KM" | "HALF" | "FULL"
  >("TEN_KM");
  const [selectedGender, setSelectedGender] = useState<
    "MALE" | "FEMALE" | "ALL"
  >("ALL");
  const [selectedGraduationStatus, setSelectedGraduationStatus] = useState<
    "ENROLLED" | "GRADUATED" | "ALL"
  >("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isIntegratedRanking, setIsIntegratedRanking] = useState(false);
  const [universities, setUniversities] = useState<string[]>([]);
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(true);
  const accessToken = useAuthStore((state) => state.accessToken);
  const [openCard, setOpenCard] = useState<string | null>(null);
  const [rankingType, setRankingType] = useState<
    | "personalRecord"
    | "personalMileage"
    | "universityFinisher"
    | "universityMileage"
  >("personalRecord");

  // 개인 기록 관련 상태
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [isLoadingRankings, setIsLoadingRankings] = useState(false);
  const [rankingsData, setRankingsData] = useState<RunningRank[]>([]);
  const [myRecordData, setMyRecordData] = useState<MyRecord | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // 개인 마일리지 관련 상태
  const [mileageRankingsData, setMileageRankingsData] = useState<
    MileageRanking[]
  >([]);
  const [myMileageRecordData, setMyMileageRecordData] =
    useState<MyMileageRecord | null>(null);
  const [isLoadingMileageRankings, setIsLoadingMileageRankings] =
    useState(false);
  const [hasSearchedMileage, setHasSearchedMileage] = useState(false);
  const [isMileageFilterExpanded, setIsMileageFilterExpanded] = useState(false);

  // 학교 랭킹 관련 상태
  const [universityRankings, setUniversityRankings] = useState<
    UniversityRanking[]
  >([]);
  const [isLoadingUniversityRankings, setIsLoadingUniversityRankings] =
    useState(false);
  const [hasSearchedUniversityRanking, setHasSearchedUniversityRanking] =
    useState(false);
  const [isUniversityRankingExpanded, setIsUniversityRankingExpanded] =
    useState(true);

  // 대학교 목록 가져오기
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await getAllUniversityName();
        setUniversities(response.data);
      } catch (error) {
        console.error("대학교 목록 조회 실패:", error);
      } finally {
        setIsLoadingUniversities(false);
      }
    };
    fetchUniversities();
  }, []);

  // 성별에 따른 데이터 필터링
  const filterByGender = (data: RunningRank[]) => {
    if (!selectedGender || selectedGender === "ALL") {
      return data;
    }
    return data.filter((runner) => runner.gender === selectedGender);
  };

  const fetchRankings = async () => {
    setIsLoadingRankings(true);
    setHasSearched(true);
    setIsFilterExpanded(false);

    try {
      const { rankings, myrecord } = await getRunningRankings(
        selectedEvent,
        selectedGender,
        searchQuery || undefined,
        accessToken ?? undefined,
        selectedGraduationStatus
      );

      const rankingsList = rankings || [];
      const filteredData = filterByGender(rankingsList);
      const rerankedData = filteredData.map((runner, index) => ({
        ...runner,
        rank: index + 1,
      }));

      setRankingsData(rerankedData);
      setMyRecordData(myrecord);
    } catch (error) {
      console.error("랭킹 조회 실패:", error);
      alert("랭킹 조회에 실패했습니다.");
    } finally {
      setIsLoadingRankings(false);
    }
  };

  // 개인 마일리지 랭킹 조회 함수
  const fetchMileageRankings = async () => {
    setIsLoadingMileageRankings(true);
    setHasSearchedMileage(true);
    setIsMileageFilterExpanded(false);

    try {
      const response = await getMileageRankings(
        selectedGender,
        isIntegratedRanking ? undefined : searchQuery,
        accessToken ?? undefined,
        selectedGraduationStatus
      );
      setMileageRankingsData(response.rankings);
      setMyMileageRecordData(response.myrecord);
    } catch (error) {
      console.error("마일리지 랭킹 조회 실패:", error);
      alert("마일리지 랭킹 조회에 실패했습니다.");
    } finally {
      setIsLoadingMileageRankings(false);
    }
  };

  // 필터 초기화
  const handleResetFilter = () => {
    setSelectedSchool("");
    setSearchQuery("");
    setSelectedEvent("HALF");
    setSelectedGender("ALL");
    setSelectedGraduationStatus("ALL");
    setIsIntegratedRanking(false);
    setRankingsData([]);
    setMyRecordData(null);
    setHasSearched(false);
    setMileageRankingsData([]);
    setHasSearchedMileage(false);
  };

  // 학교랭킹 조회 함수
  const fetchUniversityRankings = async () => {
    setIsLoadingUniversityRankings(true);
    try {
      const data = await getUniversityRankings(selectedEvent);
      setUniversityRankings(data);
      setHasSearchedUniversityRanking(true);
      setIsUniversityRankingExpanded(false);
    } catch {
      alert("학교별 랭킹 조회에 실패했습니다.");
    } finally {
      setIsLoadingUniversityRankings(false);
    }
  };

  // useEffect에서 자동 조회 제거
  useEffect(() => {
    if (rankingType === "personalRecord") {
      setUniversityRankings([]);
      setHasSearchedUniversityRanking(false);
    }
  }, [rankingType]);

  return (
    <div className="min-h-screen bg-white text-black max-w-md mx-auto">
      {/* 랭킹 타입 토글 - 탭 형태 */}
      <div className="p-4">
        <div className="flex bg-gray-100 rounded-2xl p-1 overflow-x-auto">
          <button
            className={`flex-1 px-3 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
              rankingType === "personalRecord"
                ? "bg-black text-white shadow-sm"
                : "text-gray-600 hover:text-black"
            }`}
            onClick={() => setRankingType("personalRecord")}
          >
            개인 기록
          </button>
          <button
            className={`flex-1 px-3 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
              rankingType === "personalMileage"
                ? "bg-black text-white shadow-sm"
                : "text-gray-600 hover:text-black"
            }`}
            onClick={() => setRankingType("personalMileage")}
          >
            개인 마일리지
          </button>
          <button
            className={`flex-1 px-3 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
              rankingType === "universityFinisher"
                ? "bg-black text-white shadow-sm"
                : "text-gray-600 hover:text-black"
            }`}
            onClick={() => setRankingType("universityFinisher")}
          >
            학교 완주자
          </button>
          <button
            className={`flex-1 px-3 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all opacity-50 cursor-not-allowed ${
              rankingType === "universityMileage"
                ? "bg-black text-white shadow-sm"
                : "text-gray-600"
            }`}
            disabled
          >
            학교 마일리지
          </button>
        </div>
      </div>

      {/* 필터/리스트 분기 */}
      {rankingType === "personalRecord" ? (
        <PersonalRecordSection
          selectedSchool={selectedSchool}
          setSelectedSchool={setSelectedSchool}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
          selectedGender={selectedGender}
          setSelectedGender={setSelectedGender}
          selectedGraduationStatus={selectedGraduationStatus}
          setSelectedGraduationStatus={setSelectedGraduationStatus}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isIntegratedRanking={isIntegratedRanking}
          setIsIntegratedRanking={setIsIntegratedRanking}
          isFilterExpanded={isFilterExpanded}
          setIsFilterExpanded={setIsFilterExpanded}
          isLoadingRankings={isLoadingRankings}
          fetchRankings={fetchRankings}
          handleResetFilter={handleResetFilter}
          universities={universities}
          isLoadingUniversities={isLoadingUniversities}
          hasSearched={hasSearched}
          rankingsData={rankingsData}
          myRecordData={myRecordData}
          openCard={openCard}
          setOpenCard={setOpenCard}
        />
      ) : rankingType === "personalMileage" ? (
        <PersonalMileageSection
          selectedGender={selectedGender}
          setSelectedGender={setSelectedGender}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isIntegratedRanking={isIntegratedRanking}
          setIsIntegratedRanking={setIsIntegratedRanking}
          isMileageFilterExpanded={isMileageFilterExpanded}
          setIsMileageFilterExpanded={setIsMileageFilterExpanded}
          isLoadingMileageRankings={isLoadingMileageRankings}
          fetchMileageRankings={fetchMileageRankings}
          handleResetFilter={handleResetFilter}
          universities={universities}
          isLoadingUniversities={isLoadingUniversities}
          hasSearchedMileage={hasSearchedMileage}
          mileageRankingsData={mileageRankingsData}
          myMileageRecordData={myMileageRecordData}
          openCard={openCard}
          setOpenCard={setOpenCard}
        />
      ) : (
        <UniversityRankingSection
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
          isUniversityRankingExpanded={isUniversityRankingExpanded}
          setIsUniversityRankingExpanded={setIsUniversityRankingExpanded}
          isLoadingUniversityRankings={isLoadingUniversityRankings}
          fetchUniversityRankings={fetchUniversityRankings}
          hasSearchedUniversityRanking={hasSearchedUniversityRanking}
          universityRankings={universityRankings}
        />
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          로딩중...
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}
