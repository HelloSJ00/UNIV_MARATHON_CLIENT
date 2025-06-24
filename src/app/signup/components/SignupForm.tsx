"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { getAllUniversityName } from "@/app/api/common/getAllUniversityName";
import { getMajorOfUniversity } from "@/app/api/common/getMajorOfUniversity";
import { checkEmailAvailable } from "@/app/api/common/checkEmail";
import { signup, type SignupForm } from "../api/reqSignup";
import { uploadToS3 } from "@/utils/s3";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProfileImageUploader from "./ProfileImageUploader";
import EmailInputWithCheck from "./EmailInputWithCheck";
import PasswordFields from "./PasswordFields";
import StudentIdSelect from "./StudentIdSelect";
import SchoolInfoFields from "./SchoolInfoFields";
import BasicInfoFields from "./BasicInfoFields";

const SignupForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SignupForm & { passwordConfirm: string }>({
    defaultValues: {
      isNameVisible: true,
      isStudentNumberVisible: true,
      isMajorVisible: true,
      graduationStatus: "ENROLLED",
    },
  });
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
  const isNameVisible = watch("isNameVisible");
  const isMajorVisible = watch("isMajorVisible");
  const router = useRouter();

  useEffect(() => {
    setValue("isNameVisible", true);
    setValue("isStudentNumberVisible", true);
    setValue("isMajorVisible", true);
    setValue("graduationStatus", "ENROLLED");
  }, [setValue]);

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

  // register 함수를 사용하여 필수 필드들을 등록
  useEffect(() => {
    register("email", { required: "이메일을 입력해주세요" });
    register("password", { required: "비밀번호를 입력해주세요" });
    register("name", { required: "이름을 입력해주세요" });
    register("birthDate", { required: "생년월일을 선택해주세요" });
    register("gender", { required: "성별을 선택해주세요" });
    register("university", { required: "대학교를 선택해주세요" });
    register("major", { required: "학과를 선택해주세요" });
    register("studentNumber", { required: "학번을 선택해주세요" });
    register("graduationStatus", { required: "재학 상태를 선택해주세요" });
  }, [register]);

  const onSubmit = async (data: SignupForm & { passwordConfirm: string }) => {
    console.log("onSubmit 함수 실행됨");

    // 이메일 중복 체크 확인
    if (emailCheckResult !== "available") {
      alert("이메일 중복 확인을 완료해주세요.");
      return;
    }

    try {
      let profileImageUrl = null;
      if (selectedFile) {
        console.log("프로필 이미지 업로드 시작");
        const { url } = await uploadToS3(selectedFile);
        profileImageUrl = url;
        console.log("프로필 이미지 업로드 완료:", url);
      }
      const signupData = {
        ...data,
        profileImage: profileImageUrl,
      };
      console.log("[회원가입 데이터]", signupData);
      const response = await signup(signupData);
      console.log("[회원가입 결과]", response);
      alert("회원가입이 완료되었습니다!");
      router.push("/login");
    } catch (error) {
      console.error("[회원가입 에러]", error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">계정 만들기</h2>
        <p className="text-gray-600">전국 대학생 순위를 확인해 보세요</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault(); // 기본 제출 동작 방지
          console.log("폼 제출 시작");
          console.log("현재 에러 상태:", errors);
          handleSubmit(
            (data) => {
              console.log("유효성 검사 통과, 데이터:", data);
              onSubmit(data);
            },
            (errors) => {
              console.log("폼 유효성 검사 실패:", errors);
              // 에러 메시지 표시
              if (errors.email) alert("이메일을 확인해주세요.");
              if (errors.password) alert("비밀번호를 확인해주세요.");
              if (errors.name) alert("이름을 입력해주세요.");
              if (errors.birthDate) alert("생년월일을 선택해주세요.");
              if (errors.gender) alert("성별을 선택해주세요.");
              if (errors.university) alert("대학교를 선택해주세요.");
              if (errors.major) alert("학과를 선택해주세요.");
              if (errors.studentNumber) alert("학번을 선택해주세요.");
              if (errors.graduationStatus) alert("재학 상태를 선택해주세요.");
            }
          )(e);
        }}
        className="space-y-6"
      >
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
            isNameVisible={isNameVisible}
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
          isMajorVisible={isMajorVisible}
        />

        {/* 회원가입 버튼 */}
        <Button
          type="submit"
          className="w-full h-14 bg-black text-white hover:bg-gray-800 rounded-2xl text-lg font-medium"
          onClick={() => {
            console.log("회원가입 버튼 클릭 - 폼 제출 시작");
          }}
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
