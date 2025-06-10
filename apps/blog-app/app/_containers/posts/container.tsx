import { getPosts } from "./fetcher";

export async function Posts() {
  const posts = await getPosts();

  return (
    <ul className="flex flex-col gap-4">
      {posts.map((post) => (
        <li key={post.id} className="border-b border-gray-200 p-4">
          <h2 className="text-lg font-bold">{post.title}</h2>
          <p className="text-sm text-gray-500">{post.body}</p>
        </li>
      ))}
    </ul>
  );
}
