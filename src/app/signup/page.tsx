"use client";

import SignupHeader from "./components/SignupHeader";
import SignupForm from "./components/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-white text-black max-w-md mx-auto">
      <SignupHeader />
      <SignupForm />
    </div>
  );
}
