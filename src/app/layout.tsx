import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import QueryProvider from "@/components/providers/QueryProvider";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Univ Marathon Ranking",
  description: "대학생 마라톤 랭킹 서비스",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/univmarathon.svg" type="image/svg+xml" />
      </head>
      <body className={inter.className}>
        <QueryProvider>
          <ProtectedRoute>{children}</ProtectedRoute>
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
