import axios from "@/lib/axios";

export async function checkEmailAvailable(email: string): Promise<boolean> {
  const url = `${
    process.env.NEXT_PUBLIC_BASE_SERVER_API_URL
  }/auth/check-email?email=${encodeURIComponent(email)}`;
  console.log("[checkEmailAvailable] 요청 URL:", url);
  const response = await axios.get(url);
  console.log("[checkEmailAvailable] 응답:", response.data);
  return response.data.data === true;
}
