"use client";

import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export const Button = ({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <button
      type="button"
      className={twMerge(
        className,
        "p-2 border-2 border-gray-300 rounded-md bg-white text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
