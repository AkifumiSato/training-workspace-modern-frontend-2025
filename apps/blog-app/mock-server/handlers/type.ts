export type Post = {
  id: number;
  title: string;
  summary: string;
  body: string;
};

export type PostsResponse = {
  posts: PostSummary[];
  total: number;
  skip: number;
  limit: number;
};

export type PostSummary = {
  id: number;
  title: string;
  summary: string;
};
