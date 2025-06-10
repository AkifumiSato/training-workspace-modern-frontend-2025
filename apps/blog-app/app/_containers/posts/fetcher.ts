export async function getPosts(): Promise<Post[]> {
  // https://dummyjson.com/docs/posts#posts-all
  const res = await fetch("https://dummyjson.com/posts");
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
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;
  userId: number;
};
