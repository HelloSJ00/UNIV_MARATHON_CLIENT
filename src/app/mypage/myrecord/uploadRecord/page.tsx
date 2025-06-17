"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X, Calendar, Clock, Trophy, Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import UploadHeader from "./components/UploadHeader";

export default function UploadRecordPage() {
  const router = useRouter();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [recordTime, setRecordTime] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventName, setEventName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const events = [
    { value: "10KM", label: "10KM" },
    { value: "HALF", label: "하프마라톤 (21.1KM)" },
    { value: "FULL", label: "풀마라톤 (42.195KM)" },
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
  };

  const handleSubmit = async () => {
    if (
      !uploadedImage ||
      !selectedEvent ||
      !recordTime ||
      !eventDate ||
      !eventName
    ) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    // 서버 제출 시뮬레이션
    setTimeout(() => {
      setIsSubmitting(false);
      alert("기록증이 성공적으로 제출되었습니다!");
      router.push("/mypage/myrecord");
    }, 2000);
  };

  const isFormValid =
    uploadedImage && selectedEvent && recordTime && eventDate && eventName;

  return (
    <div className="min-h-screen bg-white text-black max-w-md mx-auto">
      {/* Header */}
      <UploadHeader />

      <div className="p-4 space-y-6">
        {/* 기록증 사진 업로드 */}
        <div className="bg-gray-50 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Camera className="w-5 h-5" />
            <h3 className="text-lg font-bold">기록증 사진</h3>
          </div>

          {!uploadedImage ? (
            <label className="block">
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-gray-400 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium mb-2">
                  기록증 사진을 업로드하세요
                </p>
                <p className="text-sm text-gray-500">
                  JPG, PNG 파일만 지원됩니다
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative">
              <img
                src={uploadedImage || "/placeholder.svg"}
                alt="업로드된 기록증"
                className="w-full rounded-2xl border border-gray-200"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* 기록 정보 입력 */}
        <div className="bg-gray-50 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5" />
            <h3 className="text-lg font-bold">기록 정보</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">종목</label>
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger className="h-12 rounded-2xl border-gray-200 bg-white">
                  <SelectValue placeholder="종목을 선택하세요" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {events.map((event) => (
                    <SelectItem
                      key={event.value}
                      value={event.value}
                      className="rounded-xl"
                    >
                      {event.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                기록 시간
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="예: 1:23:45 또는 45:30"
                  value={recordTime}
                  onChange={(e) => setRecordTime(e.target.value)}
                  className="pl-10 h-12 rounded-2xl border-gray-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                대회 날짜
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="pl-10 h-12 rounded-2xl border-gray-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                대회명
              </label>
              <Input
                type="text"
                placeholder="예: 2024 서울국제마라톤"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="h-12 rounded-2xl border-gray-200"
              />
            </div>
          </div>
        </div>

        {/* 제출하기 버튼 */}
        <div className="space-y-4 pb-6">
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className="w-full h-14 bg-black text-white hover:bg-gray-800 rounded-2xl text-lg font-medium disabled:bg-gray-200 disabled:text-gray-500"
          >
            {isSubmitting ? "제출 중..." : "제출하기"}
          </Button>

          {/* 주의사항 */}
          <div className="bg-yellow-50 rounded-2xl p-4">
            <h4 className="font-medium text-yellow-800 mb-2">
              ⚠️ 제출 전 확인사항
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• 기록증 사진이 선명하고 모든 정보가 보이는지 확인하세요</li>
              <li>• 입력한 정보가 기록증과 일치하는지 확인하세요</li>
              <li>• 제출 후에는 수정이 불가능합니다</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
