import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 보호된 라우트 목록
const protectedRoutes = ["/home", "/profile", "/marathon"];
// 인증이 필요없는 라우트 목록
const authRoutes = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("auth-storage")?.value;

  // 보호된 라우트에 접근하려고 할 때
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!accessToken) {
      // 토큰이 없으면 로그인 페이지로 리다이렉트
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 이미 로그인한 사용자가 로그인/회원가입 페이지에 접근하려고 할 때
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (accessToken) {
      // 토큰이 있으면 홈 페이지로 리다이렉트
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  return NextResponse.next();
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
