"use client";

import type React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Upload,
  GraduationCap,
  Mail,
  Save,
  Loader2,
  X,
  Calendar,
} from "lucide-react";
import CommonHeader from "../components/CommonHeader";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { getAllUniversityName } from "@/app/api/getAllUniversityName";
import { getMajorOfUniversity } from "@/app/api/getMajorOfUniversity";
import { uploadToS3 } from "@/utils/s3";
import { updateUser } from "@/app/api/user";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  // 수정할 데이터 상태
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    gender: "MALE" as "MALE" | "FEMALE",
    universityName: "",
    majorName: "",
    universityEmail: "",
    profileImageUrl: "",
    isChangeUniversity: false,
  });

  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [departments, setDepartments] = useState<string[]>([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [schoolSearchQuery, setSchoolSearchQuery] = useState("");
  const [departmentSearchQuery, setDepartmentSearchQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingSchool, setIsEditingSchool] = useState(false);
  const [universities, setUniversities] = useState<string[]>([]);
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(true);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

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

  // 학교 선택시 학과 로드
  useEffect(() => {
    if (selectedSchool) {
      setIsLoadingDepartments(true);

      // 학교가 변경된 경우에만 학과 초기화
      if (selectedSchool !== user?.universityName) {
        setSelectedDepartment("");
        setFormData((prev) => ({ ...prev, majorName: "" }));
      }

      setDepartmentSearchQuery("");

      const fetchMajors = async () => {
        try {
          const response = await getMajorOfUniversity(selectedSchool);
          setDepartments(response.data);
        } catch (error) {
          console.error("학과 목록 조회 실패:", error);
        } finally {
          setIsLoadingDepartments(false);
        }
      };

      fetchMajors();
    } else {
      setDepartments([]);
      setSelectedDepartment("");
      setFormData((prev) => ({ ...prev, majorName: "" }));
      setDepartmentSearchQuery("");
    }
  }, [selectedSchool, user?.universityName]);

  // 컴포넌트 마운트시 기존 데이터로 폼 초기화
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        birthDate: user.birthDate || "",
        gender: user.gender || "MALE",
        universityName: user.universityName || "",
        majorName: user.majorName || "",
        universityEmail: user.universityEmail || "",
        profileImageUrl: user.profileImageUrl || "",
        isChangeUniversity: false,
      });
      setSelectedSchool(user.universityName || "");
      setSelectedDepartment(user.majorName || "");
    }
  }, [user]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImageFile(file); // 파일 상태 저장
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setFormData((prev) => ({ ...prev, profileImageUrl: imageUrl || "" }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, profileImageUrl: "" }));
    setProfileImageFile(null);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value || "" }));
  };

  const handleSchoolChange = (school: string) => {
    setSelectedSchool(school);
    setSchoolSearchQuery(school);
    setFormData((prev) => ({
      ...prev,
      universityName: school,
      isChangeUniversity: school !== user?.universityName,
    }));
  };

  const handleDepartmentChange = (department: string) => {
    setSelectedDepartment(department);
    setFormData((prev) => ({ ...prev, majorName: department }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.birthDate ||
      !formData.gender ||
      !selectedSchool ||
      !selectedDepartment ||
      !formData.universityEmail
    ) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    setIsSaving(true);

    try {
      let profileImageUrl = formData.profileImageUrl;

      // 새 파일이 있으면 S3에 업로드
      if (profileImageFile) {
        const { url } = await uploadToS3(profileImageFile);
        profileImageUrl = url;
      }

      // 서버에 유저 정보 업데이트 요청 전 콘솔 출력
      console.log("폼 전송 데이터:", {
        name: formData.name,
        birthDate: formData.birthDate,
        gender: formData.gender,
        universityName: selectedSchool,
        majorName: selectedDepartment,
        universityEmail: formData.universityEmail,
        profileImageUrl,
      });
      const response = await updateUser({
        name: formData.name,
        birthDate: formData.birthDate,
        gender: formData.gender,
        universityName: selectedSchool,
        majorName: selectedDepartment,
        universityEmail: formData.universityEmail,
        profileImageUrl,
      });
      // 서버 응답 콘솔 출력
      console.log("서버 응답:", response);

      // 서버에서 받은 최신 유저 정보로 zustand 업데이트
      setUser({
        ...response.data,
        role: response.data.role === "ROLE_ADMIN" ? "ROLE_ADMIN" : "ROLE_USER",
        runningRecords: {
          HALF: response.data.runningRecords.HALF
            ? {
                ...response.data.runningRecords.HALF,
                id: 0,
                userId: 0,
                imageUrl: "",
                createdAt: "",
                updatedAt: "",
              }
            : null,
          TEN_KM: response.data.runningRecords.TEN_KM
            ? {
                ...response.data.runningRecords.TEN_KM,
                id: 0,
                userId: 0,
                imageUrl: "",
                createdAt: "",
                updatedAt: "",
              }
            : null,
          FULL: response.data.runningRecords.FULL
            ? {
                ...response.data.runningRecords.FULL,
                id: 0,
                userId: 0,
                imageUrl: "",
                createdAt: "",
                updatedAt: "",
              }
            : null,
        },
      });

      alert("내 정보가 성공적으로 수정되었습니다!");
      router.push("/mypage");
    } catch (error) {
      alert("정보 수정 중 오류가 발생했습니다.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredSchools = universities.filter((school) =>
    school.toLowerCase().includes(schoolSearchQuery.toLowerCase())
  );
  const filteredDepartments = departments.filter((department) =>
    department.toLowerCase().includes(departmentSearchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-black max-w-md mx-auto">
      {/* Header */}
      <CommonHeader text="내 정보 수정" />

      {/* Main Content */}
      <div className="p-4">
        <div className="text-center mb-6">
          <p className="text-gray-600">내 정보를 최신 상태로 유지하세요</p>
        </div>

        {!user ? (
          <div className="text-center py-8">
            <p className="text-gray-600">사용자 정보를 불러오는 중...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 프로필 이미지 */}
            <div className="flex flex-col items-center space-y-3">
              <div className="relative">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                  {formData.profileImageUrl ? (
                    <Image
                      src={formData.profileImageUrl}
                      alt="프로필"
                      width={100} // 예시: 이미지의 예상 너비 (픽셀)
                      height={100} // 예시: 이미지의 예상 높이 (픽셀)
                      className="w-full h-full object-cover" // Tailwind CSS 클래스는 그대로 사용 가능
                      // priority // LCP에 중요한 이미지라면 추가 (선택 사항)
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
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {formData.profileImageUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-600">프로필 사진 변경</p>
            </div>

            {/* 기본 정보 */}
            <div className="space-y-4">
              {/* 이메일 (수정 불가) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  이메일 (변경 불가)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    value={user?.email ?? ""}
                    disabled
                    className="pl-10 h-12 rounded-2xl border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  이메일은 로그인 ID로 사용되어 변경할 수 없습니다
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  이름
                </label>
                <Input
                  type="text"
                  placeholder="이름을 입력하세요"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="h-12 rounded-2xl border-gray-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  생년월일
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) =>
                      handleInputChange("birthDate", e.target.value)
                    }
                    className="pl-10 h-12 rounded-2xl border-gray-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  성별
                </label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) =>
                    handleInputChange("gender", value as "MALE" | "FEMALE")
                  }
                  required
                >
                  <SelectTrigger className="h-12 rounded-2xl border-gray-200 w-full">
                    <SelectValue placeholder="성별을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="MALE" className="rounded-xl">
                      남성
                    </SelectItem>
                    <SelectItem value="FEMALE" className="rounded-xl">
                      여성
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  학교 이메일
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="학교 이메일을 입력하세요"
                    value={formData.universityEmail}
                    onChange={(e) =>
                      handleInputChange("universityEmail", e.target.value)
                    }
                    className="pl-10 h-12 rounded-2xl border-gray-200"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 학교 정보 */}
            <div className="bg-gray-50 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-lg font-medium">
                  <GraduationCap className="w-5 h-5" />
                  학교 정보
                </div>
                {!isEditingSchool ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingSchool(true)}
                    className="text-sm"
                  >
                    수정하기
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditingSchool(false);
                      setSelectedSchool(user?.universityName || "");
                      setSelectedDepartment(user?.majorName || "");
                    }}
                    className="text-sm"
                  >
                    취소
                  </Button>
                )}
              </div>

              {!isEditingSchool ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      학교:
                    </span>
                    <span className="text-sm text-gray-600">
                      {user?.universityName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      학과:
                    </span>
                    <span className="text-sm text-gray-600">
                      {user?.majorName}
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      학교
                    </label>
                    <Select
                      value={selectedSchool}
                      onValueChange={handleSchoolChange}
                      required
                    >
                      <SelectTrigger className="h-12 rounded-2xl border-gray-200 bg-white w-full">
                        <SelectValue placeholder="학교를 선택하세요">
                          {selectedSchool}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        <div className="p-2">
                          <Input
                            placeholder="학교명 검색..."
                            value={schoolSearchQuery}
                            onChange={(e) =>
                              setSchoolSearchQuery(e.target.value)
                            }
                            className="mb-2 rounded-xl border-gray-200"
                          />
                        </div>
                        {isLoadingUniversities ? (
                          <div className="p-2 text-sm text-gray-500 text-center">
                            학교 목록을 불러오는 중...
                          </div>
                        ) : (
                          <>
                            {filteredSchools.map((school) => (
                              <SelectItem
                                key={school}
                                value={school}
                                className="rounded-xl"
                              >
                                {school}
                              </SelectItem>
                            ))}
                            {filteredSchools.length === 0 && (
                              <div className="p-2 text-sm text-gray-500 text-center">
                                검색 결과가 없습니다
                              </div>
                            )}
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      학과
                    </label>
                    <Select
                      value={selectedDepartment}
                      onValueChange={handleDepartmentChange}
                      disabled={!selectedSchool || isLoadingDepartments}
                      required
                    >
                      <SelectTrigger className="h-12 rounded-2xl border-gray-200 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed w-full">
                        <SelectValue
                          placeholder={
                            !selectedSchool
                              ? "먼저 학교를 선택하세요"
                              : isLoadingDepartments
                              ? "학과 정보를 불러오는 중..."
                              : "학과를 선택하세요"
                          }
                        >
                          {selectedDepartment}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        {!isLoadingDepartments && departments.length > 0 && (
                          <div className="p-2">
                            <Input
                              placeholder="학과명 검색..."
                              value={departmentSearchQuery}
                              onChange={(e) =>
                                setDepartmentSearchQuery(e.target.value)
                              }
                              className="mb-2 rounded-xl border-gray-200"
                            />
                          </div>
                        )}
                        {filteredDepartments.map((department) => (
                          <SelectItem
                            key={department}
                            value={department}
                            className="rounded-xl"
                          >
                            {department}
                          </SelectItem>
                        ))}
                        {!isLoadingDepartments &&
                          filteredDepartments.length === 0 &&
                          departments.length > 0 && (
                            <div className="p-2 text-sm text-gray-500 text-center">
                              검색 결과가 없습니다
                            </div>
                          )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-yellow-50 rounded-2xl p-4 mt-4">
                    <h4 className="font-medium text-yellow-800 mb-2">
                      ⚠️ 주의사항
                    </h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>
                        • 학교 정보를 수정하면 기록 인증 및 학교 인증을 다시
                        진행해야 합니다
                      </li>
                      <li>• 학교 이메일 인증이 필요할 수 있습니다</li>
                    </ul>
                  </div>
                </>
              )}
            </div>

            {/* 저장 버튼 */}
            <div className="space-y-4 pb-6">
              <Button
                type="submit"
                disabled={isSaving}
                className="w-full h-14 bg-black text-white hover:bg-gray-800 rounded-2xl text-lg font-medium disabled:bg-gray-200 disabled:text-gray-500"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    저장 중...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    변경사항 저장
                  </>
                )}
              </Button>

              {/* 안내사항 */}
              <div className="bg-blue-50 rounded-2xl p-4">
                <h4 className="font-medium text-blue-800 mb-2">ℹ️ 수정 안내</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• 이메일은 로그인 ID로 사용되어 변경할 수 없습니다</li>
                  <li>
                    • 학교 변경시 대학교 이메일 재인증이 필요할 수 있습니다
                  </li>
                  <li>• 변경된 정보는 즉시 반영됩니다</li>
                </ul>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
