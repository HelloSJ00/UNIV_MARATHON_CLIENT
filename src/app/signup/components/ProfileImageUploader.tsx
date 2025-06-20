import Image from "next/image";
import { User, Upload } from "lucide-react";
import React from "react";

interface ProfileImageUploaderProps {
  previewImage: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileImageUploader = ({
  previewImage,
  handleImageChange,
}: ProfileImageUploaderProps) => {
  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="relative">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
          {previewImage ? (
            <Image
              src={previewImage}
              alt="미리보기"
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
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      </div>
      <p className="text-sm text-gray-600">프로필 사진 업로드</p>
    </div>
  );
};

export default ProfileImageUploader;
