"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    // 보호된 라우트 목록
    const protectedRoutes = ["/home", "/profile", "/marathon"];
    // 인증이 필요없는 라우트 목록
    const authRoutes = ["/login", "/signup"];

    // 루트 경로에서 로그인 상태일 때 /home으로 리다이렉트
    if (pathname === "/" && accessToken) {
      router.replace("/home");
      return;
    }

    // 보호된 라우트에 접근하려고 할 때
    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
      if (!accessToken) {
        router.replace("/login");
        return;
      }
    }

    // 이미 로그인한 사용자가 로그인/회원가입 페이지에 접근하려고 할 때
    if (authRoutes.some((route) => pathname.startsWith(route))) {
      if (accessToken) {
        router.replace("/home");
        return;
      }
    }
  }, [pathname, accessToken, router]);

  return <>{children}</>;
}
