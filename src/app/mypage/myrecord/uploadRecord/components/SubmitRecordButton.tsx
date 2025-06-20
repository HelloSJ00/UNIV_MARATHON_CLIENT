import React from "react";
import { Button } from "@/components/ui/button";

interface SubmitRecordButtonProps {
  onSubmit: () => void;
  disabled: boolean;
  isSubmitting: boolean;
}

const SubmitRecordButton = ({
  onSubmit,
  disabled,
  isSubmitting,
}: SubmitRecordButtonProps) => (
  <Button
    onClick={onSubmit}
    disabled={disabled}
    className="w-full h-14 bg-black text-white hover:bg-gray-800 rounded-2xl text-lg font-medium disabled:bg-gray-200 disabled:text-gray-500"
  >
    {isSubmitting ? "제출 중..." : "제출하기"}
  </Button>
);

export default SubmitRecordButton;
