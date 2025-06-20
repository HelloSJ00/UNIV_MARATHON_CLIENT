import axios from "@/lib/axios";

export interface PresignedUrlResponse {
  presignedUrl: string;
  fileUrl: string;
}

// PresignedUrl 서버로 부터 받아오기
export const getPresignedUrl = async (
  file: File
): Promise<PresignedUrlResponse> => {
  console.log("getPresignedUrl - 요청 시작:", {
    fileName: file.name,
    fileType: file.type,
  });
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_SERVER_API_URL}/user/upload-url`,
    {
      fileName: file.name,
      fileType: file.type,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  console.log("getPresignedUrl - 응답 성공:", response.data);
  return response.data;
};
