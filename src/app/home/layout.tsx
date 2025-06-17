import { ReactNode } from "react";
import Header from "@/components/common/Header";

interface HomeLayoutProps {
  children: ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className="min-h-screen max-w-md mx-auto flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
