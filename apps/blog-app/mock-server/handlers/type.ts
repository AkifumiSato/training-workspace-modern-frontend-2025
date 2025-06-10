export type Post = {
  id: number;
  title: string;
  body: string;
};

export type PostsResponse = {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
};
