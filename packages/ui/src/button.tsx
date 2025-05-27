"use client";

import type { ReactNode } from "react";

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
    <button type="button" className={className} onClick={onClick}>
      {children}
    </button>
  );
};
