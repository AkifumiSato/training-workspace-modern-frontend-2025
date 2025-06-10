export async function getPosts(): Promise<Post[]> {
  const res = await fetch("http://localhost:3001/posts");
  const data: PostsResponse = await res.json();

  return data.posts;
}

type PostsResponse = {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
};

type Post = {
  id: number;
  title: string;
  body: string;
};
