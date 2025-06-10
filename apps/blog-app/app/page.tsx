import { Posts } from "./_containers/posts";

export default function Page() {
  return (
    <div className="flex flex-col gap-10 p-10">
      <h1 className="text-3xl font-bold">Blog Posts</h1>
      <Posts />
    </div>
  );
}
