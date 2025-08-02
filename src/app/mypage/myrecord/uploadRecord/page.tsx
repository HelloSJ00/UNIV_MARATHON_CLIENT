"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CommonHeader from "../../../../components/common/CommonHeader";
import { submitRecord } from "../api/submitRecord";
import { uploadToS3 } from "@/utils/s3";
import RecordImageUploader from "./components/RecordImageUploader";
import SubmitRecordButton from "./components/SubmitRecordButton";
import UploadCaution from "./components/UploadCaution";

export default function UploadRecordPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
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
      const { url } = await uploadToS3(selectedFile);
      await submitRecord({ s3ImageUrl: url });
      alert("기록증이 성공적으로 제출되었습니다!");
      router.push("/mypage/myrecord");
    } catch (e: unknown) {
      // ✅ 여기서만 alert 처리
      const message =
        e instanceof Error ? e.message : "기록증 제출에 실패했습니다.";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = !!selectedFile;

  return (
    <div className="min-h-screen bg-white text-black max-w-md mx-auto">
      <CommonHeader text="기록증 업로드" />
      <div className="p-4 space-y-6">
        <RecordImageUploader
          previewUrl={previewUrl}
          onSelect={handleImageSelect}
          onRemove={handleRemoveImage}
        />
        <div className="space-y-4 pb-6">
          <SubmitRecordButton
            onSubmit={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            isSubmitting={isSubmitting}
          />
          <UploadCaution />
        </div>
      </div>
    </div>
  );
}
