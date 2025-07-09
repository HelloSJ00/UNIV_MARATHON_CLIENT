"use client";

import { useState, useRef, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function SegmentedControl({
  options,
  value,
  onChange,
  className = "",
}: SegmentedControlProps) {
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const updateIndicator = () => {
      const activeIndex = options.findIndex((option) => option.value === value);
      const activeButton = buttonRefs.current[activeIndex];

      if (activeButton && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const buttonRect = activeButton.getBoundingClientRect();

        setIndicatorStyle({
          width: buttonRect.width,
          left: buttonRect.left - containerRect.left,
        });
      }
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [value, options]);

  return (
    <div
      ref={containerRef}
      className={`relative flex bg-gray-100 rounded-2xl p-1 ${className}`}
      style={{ minHeight: "48px" }}
    >
      {/* Sliding indicator */}
      <div
        className="absolute top-1 bottom-1 bg-white rounded-xl shadow-sm transition-all duration-300 ease-out"
        style={{
          width: indicatorStyle.width,
          left: indicatorStyle.left,
        }}
      />

      {/* Buttons */}
      {options.map((option, index) => (
        <button
          key={option.value}
          ref={(el) => {
            buttonRefs.current[index] = el;
          }}
          onClick={() => onChange(option.value)}
          className={`relative z-10 flex-1 px-4 py-2 text-sm font-medium rounded-xl transition-colors duration-200 ${
            value === option.value
              ? "text-gray-900"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
