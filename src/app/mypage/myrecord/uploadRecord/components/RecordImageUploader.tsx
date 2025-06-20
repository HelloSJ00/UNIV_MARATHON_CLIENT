import React from "react";
import Image from "next/image";
import { Upload, X, Camera } from "lucide-react";

interface RecordImageUploaderProps {
  previewUrl: string | null;
  onSelect: (file: File) => void;
  onRemove: () => void;
}

const RecordImageUploader = ({
  previewUrl,
  onSelect,
  onRemove,
}: RecordImageUploaderProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onSelect(file);
    }
  };

  return (
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
            <p className="text-sm text-gray-500">JPG, PNG 파일만 지원됩니다</p>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </label>
      ) : (
        <div className="relative">
          <Image
            src={previewUrl}
            alt="업로드된 기록증"
            width={600}
            height={400}
            className="w-full rounded-2xl border border-gray-200"
          />
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default RecordImageUploader;
