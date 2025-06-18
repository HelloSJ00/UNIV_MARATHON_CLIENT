export async function checkEmailAvailable(email: string): Promise<boolean> {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_BASE_SERVER_API_URL
    }/auth/check-email?email=${encodeURIComponent(email)}`
  );

  if (!response.ok) {
    throw new Error("이메일 중복확인에 실패했습니다.");
  }

  const data = await response.json();
  return data.data === true;
}
