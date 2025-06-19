"use client";

import type React from "react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Upload, X, Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import CommonHeader from "../../../../components/common/CommonHeader";
import { submitRecord } from "@/app/api/records";
import { uploadToS3 } from "@/utils/s3";

export default function UploadRecordPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const events = [
  //   { value: "TEN_KM", label: "10KM" },
  //   { value: "HALF", label: "HALF" },
  //   { value: "FULL", label: "FULL" },
  // ];

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // 미리보기 URL 생성
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("기록증을 업로드 해주세요");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. S3에 이미지 업로드
      const { url } = await uploadToS3(selectedFile);

      // 2. 업로드된 이미지 URL을 서버로 전송
      await submitRecord({
        s3ImageUrl: url,
      });

      alert("기록증이 성공적으로 제출되었습니다!");
      router.push("/mypage/myrecord");
    } catch (error) {
      console.error("기록증 제출 실패:", error);
      alert("기록증 제출에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = selectedFile;

  return (
    <div className="min-h-screen bg-white text-black max-w-md mx-auto">
      {/* Header */}
      <CommonHeader text="기록증 업로드" />

      <div className="p-4 space-y-6">
        {/* 기록증 사진 업로드 */}
        <div className="bg-gray-50 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Camera className="w-5 h-5" />
            <h3 className="text-lg font-bold">기록증 사진</h3>
          </div>

          {!previewUrl ? (
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
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative">
              <Image
                src={previewUrl}
                alt="업로드된 기록증"
                width={600} // Example: Expected width of the certificate (in pixels)
                height={400} // Example: Expected height (adjust based on aspect ratio)
                className="w-full rounded-2xl border border-gray-200" // Tailwind classes still apply
                // priority // (Optional) If this image is crucial for LCP, add this
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

        {/* 기록 정보 입력
        <div className="bg-gray-50 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5" />
            <h3 className="text-lg font-bold">기록 정보</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">종목</label>
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger className="h-12 rounded-2xl border-gray-200 bg-white w-full">
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
        </div> */}

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
              <li>• 제출 후에는 수정이 불가능합니다</li>
            </ul>
            <p className="text-xs text-yellow-700 mt-3">
              ※ 가장 최근에 업로드 된 기록으로 기록됩니다. 업로드가 실패하면
              재시도를 해주시기 바랍니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
