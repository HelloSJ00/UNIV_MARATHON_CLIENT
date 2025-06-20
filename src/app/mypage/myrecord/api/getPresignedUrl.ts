import axios from "@/lib/axios";

export interface PresignedUrlResponse {
  url: string;
}

export const getPresignedUrl = async (
  file: File
): Promise<PresignedUrlResponse> => {
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
  return response.data;
};
