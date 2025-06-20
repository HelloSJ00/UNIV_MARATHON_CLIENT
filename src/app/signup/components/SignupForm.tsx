"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { getAllUniversityName } from "@/app/api/getAllUniversityName";
import { getMajorOfUniversity } from "@/app/api/getMajorOfUniversity";
import { checkEmailAvailable } from "@/app/api/checkEmail";
import { signup } from "@/app/api/signup";
import { uploadToS3 } from "@/utils/s3";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProfileImageUploader from "./ProfileImageUploader";
import EmailInputWithCheck from "./EmailInputWithCheck";
import PasswordFields from "./PasswordFields";
import StudentIdSelect from "./StudentIdSelect";
import SchoolInfoFields from "./SchoolInfoFields";
import BasicInfoFields from "./BasicInfoFields";

interface SignupFormData {
  email: string;
  name: string;
  password: string;
  birthDate: string;
  gender: "MALE" | "FEMALE";
  studentId: string;
  university: string;
  major: string;
  profileImage: FileList;
}

const SignupForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<SignupFormData & { passwordConfirm: string }>();
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("");
  const [majors, setMajors] = useState<string[]>([]);
  const [isLoadingMajors, setIsLoadingMajors] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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

  const password = watch("password");
  const gender = watch("gender");
  const router = useRouter();

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

  // 이미지 선택 시 미리보기
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (
    data: SignupFormData & { passwordConfirm: string }
  ) => {
    try {
      let profileImage = null;
      if (selectedFile) {
        const { url } = await uploadToS3(selectedFile);
        profileImage = url;
      }
      const signupData = {
        ...data,
        profileImage,
      };
      console.log("[회원가입 폼 전송]", signupData);
      await signup(signupData);
      alert("회원가입이 완료되었습니다!");
      router.push("/login");
    } catch (error) {
      alert("회원가입 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">계정 만들기</h2>
        <p className="text-gray-600">전국 대학생 순위를 확인해 보세요</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 프로필 이미지 */}
        <ProfileImageUploader
          previewImage={previewImage}
          handleImageChange={handleImageChange}
        />

        {/* 기본 정보 */}
        <div className="space-y-4">
          {/* 이메일 (아이디) */}
          <EmailInputWithCheck
            email={email}
            setEmail={setEmail}
            register={register}
            errors={errors}
            handleEmailCheck={handleEmailCheck}
            isCheckingEmail={isCheckingEmail}
            emailCheckResult={emailCheckResult}
          />

          <PasswordFields
            register={register}
            errors={errors}
            password={password}
          />

          {/* 이름, 생년월일, 성별 */}
          <BasicInfoFields
            register={register}
            errors={errors}
            setValue={setValue}
            gender={gender}
          />

          <StudentIdSelect
            register={register}
            errors={errors}
            setValue={setValue}
          />
        </div>

        {/* 학교 정보 */}
        <SchoolInfoFields
          selectedUniversity={selectedUniversity}
          setSelectedUniversity={setSelectedUniversity}
          setValue={setValue}
          isLoadingUniversities={isLoadingUniversities}
          universities={universities}
          universitySearchQuery={universitySearchQuery}
          setUniversitySearchQuery={setUniversitySearchQuery}
          errors={errors}
          selectedMajor={selectedMajor}
          setSelectedMajor={setSelectedMajor}
          isLoadingMajors={isLoadingMajors}
          majors={majors}
          majorSearchQuery={majorSearchQuery}
          setMajorSearchQuery={setMajorSearchQuery}
        />

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

      {/* Footer */}
      <div className="p-4 text-center">
        <p className="text-xs text-gray-500">
          회원가입을 통해 마라톤 기록을 관리하세요
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
