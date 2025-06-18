"use client";

import type React from "react";

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
  Lock,
  Calendar,
  Upload,
  GraduationCap,
  Mail,
  CheckCircle,
  X,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import SignupHeader from "./components/SignupHeader";
import { useForm } from "react-hook-form";
import { getAllUniversityName } from "@/app/api/getAllUniversityName";
import { getMajorOfUniversity } from "@/app/api/getMajorOfUniversity";
import { signup } from "@/app/api/signup";
import { checkEmailAvailable } from "@/app/api/checkEmail";
import { useRouter } from "next/navigation";

interface SignupFormData {
  email: string;
  name: string;
  password: string;
  birthDate: string;
  gender: "MALE" | "FEMALE";
  studentId: string;
  university: string;
  major: string;
  profileImage: string | null;
}

export default function SignupPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupFormData>();
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("");
  const [majors, setMajors] = useState<string[]>([]);
  const [isLoadingMajors, setIsLoadingMajors] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [universitySearchQuery, setUniversitySearchQuery] = useState("");
  const [majorSearchQuery, setMajorSearchQuery] = useState("");
  const [universities, setUniversities] = useState<string[]>([]);
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(true);

  // 이메일 중복체크 관련 상태
  const [email, setEmail] = useState("");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailCheckResult, setEmailCheckResult] = useState<
    "none" | "available" | "taken"
  >("none");

  // 이메일 변경시 중복체크 결과 초기화
  useEffect(() => {
    setEmailCheckResult("none");
  }, [email]);

  // 이메일 중복체크
  const handleEmailCheck = async () => {
    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("올바른 이메일 형식이 아닙니다.");
      return;
    }

    setIsCheckingEmail(true);

    try {
      const isAvailable = await checkEmailAvailable(email);
      setEmailCheckResult(isAvailable ? "available" : "taken");
    } catch (error) {
      console.error("이메일 중복확인 실패:", error);
      alert("이메일 중복확인에 실패했습니다.");
      setEmailCheckResult("none");
    } finally {
      setIsCheckingEmail(false);
    }
  };

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

  // 대학교 선택시 학과 로드
  useEffect(() => {
    if (selectedUniversity) {
      setIsLoadingMajors(true);
      setSelectedMajor("");
      setMajorSearchQuery("");
      setValue("major", "");

      const fetchMajors = async () => {
        try {
          const response = await getMajorOfUniversity(selectedUniversity);
          console.log("학과 목록:", response.data);
          setMajors(response.data);
        } catch (error) {
          console.error("학과 목록 조회 실패:", error);
        } finally {
          setIsLoadingMajors(false);
        }
      };

      fetchMajors();
    } else {
      setMajors([]);
      setSelectedMajor("");
      setMajorSearchQuery("");
      setValue("major", "");
    }
  }, [selectedUniversity, setValue]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setProfileImage(imageUrl);
        setValue("profileImage", imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: SignupFormData) => {
    console.log(data);
    try {
      const response = await signup(data);
      console.log("회원가입 성공:", response);
      router.push("/login");
    } catch (error) {
      console.error("회원가입 실패:", error);
      // TODO: 에러 처리 (예: 에러 메시지 표시)
    }
  };

  const filteredUniversities = universities.filter((university) =>
    university.toLowerCase().includes(universitySearchQuery.toLowerCase())
  );

  const filteredMajors = majors.filter((major) =>
    major.toLowerCase().includes(majorSearchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-black max-w-md mx-auto">
      {/* Header */}
      <SignupHeader />

      {/* Main Content */}
      <div className="p-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">계정 만들기</h2>
          <p className="text-gray-600">마라톤 기록 관리를 시작해보세요</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 프로필 이미지 */}
          <div className="flex flex-col items-center space-y-3">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="프로필"
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
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm text-gray-600">프로필 사진 업로드</p>
          </div>

          {/* 기본 정보 */}
          {/* 기본 정보 */}
          <div className="space-y-4">
            {/* 이메일 (아이디) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                이메일 (로그인 ID)
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="이메일을 입력하세요"
                    className="pl-10 h-12 rounded-2xl border-gray-200"
                    required
                    {...register("email", {
                      required: "이메일을 입력해주세요",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "올바른 이메일 형식이 아닙니다",
                      },
                      onChange: (e) => setEmail(e.target.value),
                    })}
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleEmailCheck}
                  disabled={!email || isCheckingEmail}
                  className="h-12 px-4 bg-black text-white hover:bg-gray-800 rounded-2xl whitespace-nowrap"
                >
                  {isCheckingEmail ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "중복확인"
                  )}
                </Button>
              </div>

              {/* 중복체크 결과 */}
              {emailCheckResult === "available" && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>사용 가능한 이메일입니다.</span>
                </div>
              )}
              {emailCheckResult === "taken" && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <X className="w-4 h-4" />
                  <span>이미 사용중인 이메일입니다.</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  {...register("password", {
                    required: "비밀번호를 입력해주세요",
                  })}
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  className="pl-10 h-12 rounded-2xl border-gray-200"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">이름</label>
              <Input
                {...register("name", { required: "이름을 입력해주세요" })}
                type="text"
                placeholder="이름을 입력하세요"
                className="h-12 rounded-2xl border-gray-200"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                생년월일
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  {...register("birthDate", {
                    required: "생년월일을 입력해주세요",
                    pattern: {
                      value: /^\d{4}-\d{2}-\d{2}$/,
                      message: "올바른 생년월일 형식이 아닙니다 (YYYY-MM-DD)",
                    },
                  })}
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  className="pl-10 h-12 rounded-2xl border-gray-200"
                />
                {errors.birthDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.birthDate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">성별</label>
              <Select
                onValueChange={(value) =>
                  setValue("gender", value as "MALE" | "FEMALE")
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
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">학번</label>
              <Select
                onValueChange={(value) => setValue("studentId", value)}
                required
              >
                <SelectTrigger className="h-12 rounded-2xl border-gray-200 w-full">
                  <SelectValue placeholder="입학년도를 선택하세요" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {Array.from({ length: 20 }, (_, i) => 2025 - i).map(
                    (year) => (
                      <SelectItem
                        key={year}
                        value={year.toString()}
                        className="rounded-xl"
                      >
                        {year}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              {errors.studentId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.studentId.message}
                </p>
              )}
            </div>
          </div>

          {/* 학교 정보 */}
          <div className="bg-gray-50 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-lg font-medium">
              <GraduationCap className="w-5 h-5" />
              학교 정보
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                대학교
              </label>
              <Select
                value={selectedUniversity}
                onValueChange={(value) => {
                  setSelectedUniversity(value);
                  setValue("university", value);
                }}
                required
                disabled={isLoadingUniversities}
              >
                <SelectTrigger className="h-12 rounded-2xl border-gray-200 bg-white w-full">
                  <SelectValue
                    placeholder={
                      isLoadingUniversities
                        ? "대학교 목록을 불러오는 중..."
                        : "대학교를 선택하세요"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <div className="p-2">
                    <Input
                      placeholder="대학교명 검색..."
                      value={universitySearchQuery}
                      onChange={(e) => setUniversitySearchQuery(e.target.value)}
                      className="mb-2 rounded-xl border-gray-200"
                    />
                  </div>
                  {filteredUniversities.map((university) => (
                    <SelectItem
                      key={university}
                      value={university}
                      className="rounded-xl"
                    >
                      {university}
                    </SelectItem>
                  ))}
                  {filteredUniversities.length === 0 && (
                    <div className="p-2 text-sm text-gray-500 text-center">
                      검색 결과가 없습니다
                    </div>
                  )}
                </SelectContent>
              </Select>
              {errors.university && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.university.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">학과</label>
              <Select
                value={selectedMajor}
                onValueChange={(value) => {
                  setSelectedMajor(value);
                  setValue("major", value);
                }}
                disabled={!selectedUniversity || isLoadingMajors}
                required
              >
                <SelectTrigger className="h-12 rounded-2xl border-gray-200 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed w-full">
                  <SelectValue
                    placeholder={
                      !selectedUniversity
                        ? "먼저 대학교를 선택하세요"
                        : isLoadingMajors
                        ? "학과 정보를 불러오는 중..."
                        : "학과를 선택하세요"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {!isLoadingMajors && majors.length > 0 && (
                    <div className="p-2">
                      <Input
                        placeholder="학과명 검색..."
                        value={majorSearchQuery}
                        onChange={(e) => setMajorSearchQuery(e.target.value)}
                        className="mb-2 rounded-xl border-gray-200"
                      />
                    </div>
                  )}
                  {filteredMajors.map((major) => (
                    <SelectItem
                      key={major}
                      value={major}
                      className="rounded-xl"
                    >
                      {major}
                    </SelectItem>
                  ))}
                  {!isLoadingMajors &&
                    filteredMajors.length === 0 &&
                    majors.length > 0 && (
                      <div className="p-2 text-sm text-gray-500 text-center">
                        검색 결과가 없습니다
                      </div>
                    )}
                </SelectContent>
              </Select>
              {errors.major && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.major.message}
                </p>
              )}
            </div>
          </div>

          {/* 회원가입 버튼 */}
          <Button
            type="submit"
            className="w-full h-14 bg-black text-white hover:bg-gray-800 rounded-2xl text-lg font-medium"
          >
            회원가입 완료
          </Button>

          {/* 로그인 링크 */}
          <div className="text-center">
            <p className="text-gray-600">
              이미 계정이 있으신가요?
              <Link
                href="/login"
                className="text-black font-medium hover:underline ml-1"
              >
                로그인
              </Link>
            </p>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="p-4 text-center">
        <p className="text-xs text-gray-500">
          회원가입을 통해 마라톤 기록을 관리하세요
        </p>
      </div>
    </div>
  );
}
