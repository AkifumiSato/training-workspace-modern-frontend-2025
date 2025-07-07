import React from "react";

export default function PostsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(10)].map((i) => (
          <li
            key={`posts-skeleton-${i}`}
            className="animate-pulse p-4 border-b border-gray-200 grid grid-rows-[auto_1fr_auto] gap-3"
          >
            <div className="h-6 bg-gray-300 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-10 bg-gray-200 rounded w-full mt-2" />
          </li>
        ))}
      </ul>
    </div>
  );
}
