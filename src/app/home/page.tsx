"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search, User, Loader2, Trophy } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import {
  getRunningRankings,
  type RunningRank,
  type MyRecord,
} from "./api/getRunningRankings";
import { getAllUniversityName } from "@/app/api/common/getAllUniversityName";
import FilterSection from "./components/FilterSection";
import RankingList from "./components/RankingList";
import InitialMessage from "./components/InitialMessage";
import MyRankCard from "./components/MyRankCard";
import {
  getUniversityRankings,
  type UniversityRanking,
} from "./api/getUniversityRankings";
import SegmentedControl from "./components/SegmentedControl";
import Image from "next/image";
import MileageFilterSection from "./components/MileageFilterSection";
import MileageRankingList, {
  MileageRunner as MileageRanking,
} from "./components/MileageRankingList";
import { getMileageRankings } from "./api/getMileageRankings";
import MyMileageRankCard from "./components/MyMileageRankCard";
import { MyMileageRecord } from "./api/getMileageRankings";

export default function HomePage() {
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
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [isLoadingRankings, setIsLoadingRankings] = useState(false);
  const [rankingsData, setRankingsData] = useState<RunningRank[]>([]);
  const [myRecordData, setMyRecordData] = useState<MyRecord | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isIntegratedRanking, setIsIntegratedRanking] = useState(false);
  const [universities, setUniversities] = useState<string[]>([]);
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(true);
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const [openCard, setOpenCard] = useState<string | null>(null);
  const [rankingType, setRankingType] = useState<
    | "personalRecord"
    | "personalMileage"
    | "universityFinisher"
    | "universityMileage"
  >("personalRecord");
  const [universityRankings, setUniversityRankings] = useState<
    UniversityRanking[]
  >([]);
  const [isLoadingUniversityRankings, setIsLoadingUniversityRankings] =
    useState(false);
  const [hasSearchedUniversityRanking, setHasSearchedUniversityRanking] =
    useState(false);
  const [isUniversityRankingExpanded, setIsUniversityRankingExpanded] =
    useState(true);

  // 개인 마일리지 관련 상태 추가
  const [mileageRankingsData, setMileageRankingsData] = useState<
    MileageRanking[]
  >([]);
  const [myMileageRecordData, setMyMileageRecordData] =
    useState<MyMileageRecord | null>(null);
  const [isLoadingMileageRankings, setIsLoadingMileageRankings] =
    useState(false);
  const [hasSearchedMileage, setHasSearchedMileage] = useState(false);
  const [isMileageFilterExpanded, setIsMileageFilterExpanded] = useState(false);

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

  const genders = [
    { value: "ALL", label: "전체" },
    { value: "MALE", label: "남성" },
    { value: "FEMALE", label: "여성" },
  ];

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

  // 개인 마일리지 랭킹 조회 함수 추가
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
    // 마일리지 관련 상태도 초기화
    setMileageRankingsData([]);
    setHasSearchedMileage(false);
  };

  // 성별 라벨 가져오기
  const getGenderLabel = (value: string) => {
    const gender = genders.find((g) => g.value === value);
    return gender ? gender.label : value;
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatPace = (seconds: number, type: "TEN_KM" | "HALF" | "FULL") => {
    let distance = 10;
    if (type === "HALF") distance = 21.0975;
    if (type === "FULL") distance = 42.195;

    const pace = seconds / distance;
    const paceMin = Math.floor(pace / 60);
    const paceSec = Math.round(pace % 60);

    return `${paceMin}'${paceSec.toString().padStart(2, "0")}"/km`;
  };

  // 학교랭킹 조회 함수 수정
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

  // 현재 월 가져오기
  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}년 ${now.getMonth() + 1}월`;
  };

  // useEffect에서 자동 조회 제거
  useEffect(() => {
    if (rankingType === "personalRecord") {
      setUniversityRankings([]);
      setHasSearchedUniversityRanking(false);
    }
  }, [rankingType]);

  const eventOptions = [
    { label: "10km", value: "TEN_KM" },
    { label: "하프마라톤", value: "HALF" },
    { label: "풀마라톤", value: "FULL" },
  ];

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
            className={`flex-1 px-3 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
              rankingType === "universityMileage"
                ? "bg-black text-white shadow-sm"
                : "text-gray-600 hover:text-black"
            }`}
            onClick={() => setRankingType("universityMileage")}
          >
            학교 마일리지
          </button>
        </div>
      </div>

      {/* 필터/리스트 분기 */}
      {rankingType === "personalRecord" ? (
        <>
          {/* Search Filter Section */}
          <div className="p-4">
            <FilterSection
              isFilterExpanded={isFilterExpanded}
              setIsFilterExpanded={setIsFilterExpanded}
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
              isLoadingRankings={isLoadingRankings}
              fetchRankings={fetchRankings}
              handleResetFilter={handleResetFilter}
              universities={universities}
              isLoadingUniversities={isLoadingUniversities}
              accessToken={accessToken}
              user={user}
            />
          </div>

          {/* Rankings Section */}
          {hasSearched ? (
            <div className="px-4 pb-6">
              <div className="bg-gray-50 rounded-3xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  {isIntegratedRanking ? (
                    <Trophy className="w-5 h-5 text-blue-500" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                  <h2 className="text-lg font-bold">
                    {isIntegratedRanking
                      ? "전국 통합 랭킹"
                      : `${selectedSchool || searchQuery} 랭킹`}
                  </h2>
                </div>

                {/* 검색 조건 표시 */}
                <div className="mb-4 p-3 bg-white rounded-2xl border border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
                    <span>검색 조건:</span>
                    {isIntegratedRanking ? (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        전국 통합
                      </span>
                    ) : (
                      <span className="font-medium text-black">
                        {selectedSchool || searchQuery}
                      </span>
                    )}
                    <span>•</span>
                    <span className="font-medium text-black">
                      {selectedEvent}
                    </span>
                    <span>•</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                      {getGenderLabel(selectedGender)}
                    </span>
                    {selectedGraduationStatus !== "ALL" && (
                      <>
                        <span>•</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          {selectedGraduationStatus === "ENROLLED"
                            ? "재학생"
                            : "졸업생"}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* 안내문구 */}
                {isLoadingRankings ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">랭킹을 불러오는 중...</p>
                  </div>
                ) : rankingsData.length > 0 ? (
                  <>
                    <MyRankCard
                      myInfo={myRecordData ?? undefined}
                      formatTime={formatTime}
                      formatPace={formatPace}
                    />
                    <p className="text-sm text-gray-600 mb-6">
                      {isIntegratedRanking
                        ? `전국 상위 100명의 랭킹을 확인할 수 있습니다`
                        : `${
                            selectedSchool || searchQuery
                          } 내 100명의 랭킹을 확인할 수 있습니다`}
                    </p>
                    <RankingList
                      rankingsData={rankingsData}
                      openCard={openCard}
                      setOpenCard={setOpenCard}
                      isIntegratedRanking={isIntegratedRanking}
                      formatTime={formatTime}
                      formatPace={formatPace}
                    />
                    <div className="mt-6 text-center">
                      <Button
                        variant="ghost"
                        className="text-gray-600 hover:text-black rounded-full"
                      >
                        더 보기
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">검색 결과가 없습니다</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <InitialMessage setIsFilterExpanded={setIsFilterExpanded} />
          )}
        </>
      ) : rankingType === "personalMileage" ? (
        <>
          {/* 개인 마일리지 필터 섹션 */}
          <div className="p-4">
            <MileageFilterSection
              isFilterExpanded={isMileageFilterExpanded}
              setIsFilterExpanded={setIsMileageFilterExpanded}
              selectedGender={selectedGender}
              setSelectedGender={setSelectedGender}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isIntegratedRanking={isIntegratedRanking}
              setIsIntegratedRanking={setIsIntegratedRanking}
              isLoadingRankings={isLoadingMileageRankings}
              fetchRankings={fetchMileageRankings}
              handleResetFilter={handleResetFilter}
              universities={universities}
              isLoadingUniversities={isLoadingUniversities}
            />
          </div>

          {/* 마일리지 랭킹 섹션 */}
          {hasSearchedMileage ? (
            <div className="px-4 pb-6">
              <div className="bg-gray-50 rounded-3xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <svg
                    className="w-5 h-5 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  <h2 className="text-lg font-bold">
                    {isIntegratedRanking
                      ? `전국 개인 마일리지 랭킹 (${getCurrentMonth()})`
                      : `${searchQuery} 개인 마일리지 랭킹 (${getCurrentMonth()})`}
                  </h2>
                </div>

                {/* 검색 조건 표시 */}
                <div className="mb-4 p-3 bg-white rounded-2xl border border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
                    <span>검색 조건:</span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                      스트라바 연동 유저
                    </span>
                    <span>•</span>
                    <span className="font-medium text-black">
                      이번달 마일리지
                    </span>
                    <span>•</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                      {getGenderLabel(selectedGender)}
                    </span>
                    {!isIntegratedRanking && searchQuery && (
                      <>
                        <span>•</span>
                        <span className="font-medium text-black">
                          {searchQuery}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {isLoadingMileageRankings ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">
                      마일리지 랭킹을 불러오는 중...
                    </p>
                  </div>
                ) : mileageRankingsData.length > 0 ? (
                  <>
                    <MyMileageRankCard
                      myInfo={myMileageRecordData ?? undefined}
                    />
                    <p className="text-sm text-gray-600 mb-6">
                      {isIntegratedRanking
                        ? `전국 스트라바 연동 유저 ${getGenderLabel(
                            selectedGender
                          )} 상위 ${
                            mileageRankingsData.length
                          }명의 이번달 마일리지 랭킹입니다`
                        : `${searchQuery} 스트라바 연동 유저 ${getGenderLabel(
                            selectedGender
                          )} 상위 ${
                            mileageRankingsData.length
                          }명의 이번달 마일리지 랭킹입니다`}
                    </p>
                    <MileageRankingList
                      rankingsData={mileageRankingsData}
                      openCard={openCard}
                      setOpenCard={setOpenCard}
                    />
                    <div className="mt-6 text-center">
                      <Button
                        variant="ghost"
                        className="text-gray-600 hover:text-black rounded-full"
                      >
                        더 보기
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">검색 결과가 없습니다</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="px-4 pb-6">
              <div className="bg-gray-50 rounded-3xl p-6 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">개인 마일리지 랭킹</h3>
                <p className="text-gray-600 mb-4">
                  스트라바 연동 유저들의
                  <br />
                  이번달 마일리지 랭킹을 확인해보세요
                </p>
                <div className="flex flex-col gap-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-2 justify-center">
                    <svg
                      className="w-4 h-4 text-orange-500"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0l-7 13.828h4.172" />
                    </svg>
                    <span>스트라바 연동 필수</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <Trophy className="w-4 h-4 text-orange-500" />
                    <span>월간 마일리지 기준 랭킹</span>
                  </div>
                </div>
                <Button
                  onClick={() => setIsMileageFilterExpanded(true)}
                  variant="outline"
                  className="border-gray-200 hover:bg-gray-100 rounded-2xl"
                >
                  검색 시작하기
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* 학교랭킹: 종목만 선택하는 필터 + 조회하기 버튼 */}
          <div className="p-4">
            <div className="bg-white border border-gray-200 rounded-3xl mb-4 shadow-sm">
              {/* 헤더 클릭 시 토글 */}
              <div
                className={`flex items-center gap-2 cursor-pointer select-none transition-all ${
                  isUniversityRankingExpanded ? "mb-4 p-6" : "p-4"
                }`}
                onClick={() => setIsUniversityRankingExpanded((prev) => !prev)}
              >
                <Trophy className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold flex-1">학교별 랭킹 조회</h2>
                <span>
                  {isUniversityRankingExpanded ? (
                    <svg className="w-5 h-5" viewBox="0 0 20 20">
                      <path
                        d="M6 8l4 4 4-4"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 20 20">
                      <path
                        d="M14 12l-4-4-4 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                  )}
                </span>
              </div>

              {/* 펼쳐진 경우에만 필터/버튼 노출 */}
              {isUniversityRankingExpanded && (
                <div className="space-y-4 px-6 pb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      종목 선택
                    </label>
                    {/* 기존 Select → SegmentedControl로 변경 */}
                    <SegmentedControl
                      options={eventOptions}
                      value={selectedEvent}
                      onChange={(value: string) =>
                        setSelectedEvent(value as "TEN_KM" | "HALF" | "FULL")
                      }
                    />
                  </div>
                  <Button
                    className="w-full h-12 bg-black text-white hover:bg-gray-800 rounded-2xl font-bold"
                    onClick={fetchUniversityRankings}
                    disabled={isLoadingUniversityRankings}
                  >
                    {isLoadingUniversityRankings ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        조회 중...
                      </div>
                    ) : (
                      "조회하기"
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* 조회하지 않았을 때 안내 메시지 */}
          {!hasSearchedUniversityRanking && (
            <div className="px-4 pb-6">
              <div className="bg-gray-50 rounded-3xl p-6 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">학교별 완주자수 랭킹</h3>
                <p className="text-gray-600 mb-4">
                  각 대학교별 마라톤 완주자 수를
                  <br />
                  확인해보세요
                </p>
                <div className="flex flex-col gap-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-2 justify-center">
                    <Trophy className="w-4 h-4 text-blue-500" />
                    <span>대학교별 완주자 수 순위</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <User className="w-4 h-4" />
                    <span>종목별 상세 랭킹 제공</span>
                  </div>
                </div>
                <a
                  href="https://second-pony-0ca.notion.site/Univ-Marathon-Rank-218b52264a2d809faafaf470e1c92eae"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mb-3 text-blue-600 underline hover:text-blue-800 text-sm font-medium"
                >
                  사용 가이드 및 안내
                </a>
                <p className="text-xs text-gray-500">
                  위의 종목을 선택하고 조회하기 버튼을 눌러주세요
                </p>
              </div>
            </div>
          )}

          {/* 조회하기 버튼을 누른 후에만 리스트 표시 */}
          {hasSearchedUniversityRanking && (
            <div className="px-4 pb-6">
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-blue-500" />
                  학교별 완주자수 랭킹
                  <span className="px-2 py-1 bg-black text-white rounded-full text-xs font-medium">
                    {selectedEvent === "TEN_KM"
                      ? "10km"
                      : selectedEvent === "HALF"
                      ? "하프마라톤"
                      : "풀마라톤"}
                  </span>
                </h2>

                {/* 검색 조건 표시 */}
                <div className="mb-4 p-3 bg-white rounded-2xl border border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
                    <span>검색 조건:</span>
                    <span className="px-2 py-1 bg-black text-white rounded-full text-xs font-medium">
                      {selectedEvent === "TEN_KM"
                        ? "10km"
                        : selectedEvent === "HALF"
                        ? "하프마라톤"
                        : "풀마라톤"}
                    </span>
                  </div>
                </div>

                {/* 안내문구는 학교랭킹에만 */}
                <p className="text-sm text-gray-600 mb-6">
                  전국 상위 30개의 학교 랭킹을 확인할 수 있습니다
                </p>

                {isLoadingUniversityRankings ? (
                  <div className="flex justify-center items-center h-24">
                    <Loader2 className="animate-spin w-6 h-6 text-gray-400" />
                  </div>
                ) : universityRankings.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p>랭킹 데이터가 없습니다.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {universityRankings.map((item, index) => {
                      console.log(
                        "universityImage:",
                        item.universityImage,
                        "for",
                        item.universityName
                      );
                      return (
                        <div
                          key={item.universityName}
                          className={`flex items-center p-4 rounded-2xl transition-colors ${
                            index === 0
                              ? "bg-yellow-50 border border-yellow-200"
                              : index === 1
                              ? "bg-gray-50 border border-gray-200"
                              : index === 2
                              ? "bg-orange-50 border border-orange-200"
                              : "bg-gray-50 hover:bg-gray-100"
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-4 ${
                              index === 0
                                ? "bg-yellow-500 text-white"
                                : index === 1
                                ? "bg-gray-400 text-white"
                                : index === 2
                                ? "bg-orange-500 text-white"
                                : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {item.ranking}
                          </div>
                          <div className="w-8 h-8 rounded-full overflow-hidden mr-3 bg-gray-100 flex-shrink-0">
                            <Image
                              src={item.universityImage || "/placeholder.svg"}
                              alt={`${item.universityName} 로고`}
                              width={32}
                              height={32}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <span className="font-medium">
                              {item.universityName}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-lg">
                              {item.finisherCount}
                            </span>
                            <span className="text-sm text-gray-500 ml-1">
                              명
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
