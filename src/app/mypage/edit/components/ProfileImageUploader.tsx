import Image from "next/image";
import { User, Upload, X } from "lucide-react";
import React from "react";

interface ProfileImageUploaderProps {
  profileImageUrl: string;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

export default function ProfileImageUploader({
  profileImageUrl,
  onImageUpload,
  onRemoveImage,
}: ProfileImageUploaderProps) {
  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="relative">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
          {profileImageUrl ? (
            <Image
              src={profileImageUrl}
              alt="프로필"
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <label className="absolute bottom-0 right-0 w-8 h-8 bg-black rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors">
          <Upload className="w-4 h-4 text-white" />
          <input
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            className="hidden"
          />
        </label>
        {profileImageUrl && (
          <button
            type="button"
            onClick={onRemoveImage}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
      <p className="text-sm text-gray-600">프로필 사진 변경</p>
    </div>
  );
}
