"use client";

import { useState, useEffect } from "react";
import CommonHeader from "../../../components/common/CommonHeader";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { getAllUniversityName } from "@/app/api/common/getAllUniversityName";
import { getMajorOfUniversity } from "@/app/api/common/getMajorOfUniversity";
import { uploadToS3 } from "@/utils/s3";
import { updateUser } from "@/app/api/common/user";
import ProfileImageUploader from "./components/ProfileImageUploader";
import BasicInfoFields from "./components/BasicInfoFields";
import SchoolInfoFields from "./components/SchoolInfoFields";
import SaveButton from "./components/SaveButton";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  // 수정할 데이터 상태
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    gender: "MALE" as "MALE" | "FEMALE",
    studentNumber: "",
    universityName: "",
    majorName: "",
    universityEmail: "",
    profileImageUrl: "",
    isNameVisible: true,
    isStudentNumberVisible: true,
    isMajorVisible: true,
    graduationStatus: "",
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
      console.log("[EditProfilePage] User data:", user);
      setFormData({
        name: user.name || "",
        birthDate: user.birthDate || "",
        gender: user.gender || "MALE",
        studentNumber: user.studentNumber || "",
        universityName: user.universityName || "",
        majorName: user.majorName || "",
        universityEmail: user.universityEmail || "",
        profileImageUrl: user.profileImageUrl || "",
        isNameVisible: user.nameVisible,
        isStudentNumberVisible: user.studentNumberVisible,
        isMajorVisible: user.majorVisible,
        graduationStatus: user.graduationStatus || "",
        isChangeUniversity: false,
      });
      console.log("[EditProfilePage] FormData initialized:", formData);
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

  const handleInputChange = (
    field: string,
    value: string | number | boolean
  ) => {
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

    // 제출 전 각 필드 값 콘솔 출력
    console.log("제출 전 필드 값:", {
      name: formData.name,
      birthDate: formData.birthDate,
      gender: formData.gender,
      selectedSchool,
      selectedDepartment,
      universityEmail: formData.universityEmail,
    });

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

      // graduationStatus가 비어 있으면 기존 user 값 사용
      const graduationStatusToSubmit =
        formData.graduationStatus || user?.graduationStatus || "";

      // 서버에 유저 정보 업데이트 요청 전 콘솔 출력
      console.log("폼 전송 데이터:", {
        ...formData,
        universityName: selectedSchool,
        majorName: selectedDepartment,
        profileImageUrl,
      });
      const response = await updateUser({
        name: formData.name,
        birthDate: formData.birthDate,
        gender: formData.gender,
        studentNumber: formData.studentNumber,
        universityName: selectedSchool,
        majorName: selectedDepartment,
        universityEmail: formData.universityEmail,
        isNameVisible: formData.isNameVisible,
        isStudentNumberVisible: formData.isStudentNumberVisible,
        isMajorVisible: formData.isMajorVisible,
        graduationStatus: graduationStatusToSubmit,
        profileImageUrl,
      });
      // 서버 응답 콘솔 출력
      console.log("서버 응답:", response);

      // 서버에서 받은 최신 유저 정보로 zustand 업데이트
      setUser({
        ...response.data,
        role: response.data.role === "ROLE_ADMIN" ? "ROLE_ADMIN" : "ROLE_USER",
        nameVisible: formData.isNameVisible,
        studentNumberVisible: formData.isStudentNumberVisible,
        majorVisible: formData.isMajorVisible,
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
            <ProfileImageUploader
              profileImageUrl={formData.profileImageUrl}
              onImageUpload={handleImageUpload}
              onRemoveImage={handleRemoveImage}
            />
            <BasicInfoFields
              formData={formData}
              onInputChange={handleInputChange}
              userEmail={user.email}
            />
            <SchoolInfoFields
              isEditingSchool={isEditingSchool}
              setIsEditingSchool={setIsEditingSchool}
              selectedSchool={selectedSchool}
              setSelectedSchool={setSelectedSchool}
              selectedDepartment={selectedDepartment}
              setSelectedDepartment={setSelectedDepartment}
              universities={universities}
              departments={departments}
              isLoadingUniversities={isLoadingUniversities}
              isLoadingDepartments={isLoadingDepartments}
              schoolSearchQuery={schoolSearchQuery}
              setSchoolSearchQuery={setSchoolSearchQuery}
              departmentSearchQuery={departmentSearchQuery}
              setDepartmentSearchQuery={setDepartmentSearchQuery}
              handleSchoolChange={handleSchoolChange}
              handleDepartmentChange={handleDepartmentChange}
              user={user}
              formData={formData}
              onInputChange={handleInputChange}
            />
            <SaveButton isSaving={isSaving} onSubmit={handleSubmit} />
          </form>
        )}
      </div>
    </div>
  );
}
