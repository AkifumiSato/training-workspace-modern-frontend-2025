import { Button } from "@repo/ui/button";
import Link from "next/link";
import { getPosts } from "./fetcher";

export async function Posts() {
  const posts = await getPosts();

  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <li
          key={post.id}
          className="grid grid-rows-[auto_1fr_auto] gap-3 border-b border-gray-200 p-4"
        >
          <h2 className="text-lg font-bold">{post.title}</h2>
          <p className="text-sm text-gray-500">{post.body}</p>
          <Button asChild variant="outline">
            <Link href={`/posts/${post.id}`}>View Post</Link>
          </Button>
        </li>
      ))}
    </ul>
  );
}
