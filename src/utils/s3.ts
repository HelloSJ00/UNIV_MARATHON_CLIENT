import { getPresignedUrl } from "@/app/mypage/myrecord/api/getPresignedUrl";

export const uploadToS3 = async (file: File) => {
  try {
    console.log("1. 파일 정보:", {
      name: file.name,
      type: file.type,
    });

    // 1. 서버에서 presigned URL 받아오기
    console.log("2. Presigned URL 요청 시작");
    const { presignedUrl } = await getPresignedUrl(file);
    console.log("3. Presigned URL 받음:", presignedUrl);

    // 2. presigned URL을 사용하여 S3에 직접 업로드
    console.log("4. S3 업로드 시작");
    const uploadResponse = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
    });

    if (!uploadResponse.ok) {
      console.error("S3 업로드 실패:", {
        status: uploadResponse.status,
        statusText: uploadResponse.statusText,
      });
      throw new Error("S3 업로드에 실패했습니다.");
    }
    console.log("5. S3 업로드 성공");

    // 3. 업로드된 이미지의 URL 반환 (presigned URL에서 추출)
    const url = presignedUrl.split("?")[0];
    console.log("6. 최종 이미지 URL:", url);
    return { url };
  } catch (error) {
    console.error("S3 업로드 과정에서 에러 발생:", error);
    throw new Error("이미지 업로드에 실패했습니다.");
  }
};
