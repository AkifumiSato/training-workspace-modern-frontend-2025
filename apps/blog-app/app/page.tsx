import { Suspense } from "react";
import { Posts } from "./_containers/posts";
import PostsSkeleton from "./_containers/posts/PostsSkeleton";

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-3xl font-bold">Blog Posts</h1>
      <Suspense fallback={<PostsSkeleton />}>
        <Posts />
      </Suspense>
    </div>
  );
}
