"use client";
import { ReactNode } from "react";
import CommonHeader from "@/components/common/CommonHeader";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function HomeLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen max-w-md mx-auto flex flex-col">
      <CommonHeader text="관리자페이지" />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
