import axios from "@/lib/axios";

export async function checkEmailAvailable(email: string): Promise<boolean> {
  const response = await axios.get(
    `${
      process.env.NEXT_PUBLIC_BASE_SERVER_API_URL
    }/auth/check-email?email=${encodeURIComponent(email)}`
  );

  return response.data.data === true;
}
