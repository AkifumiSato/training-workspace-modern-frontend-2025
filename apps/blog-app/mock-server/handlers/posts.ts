import type { ServerResponse } from "node:http";
import { extractPathParams, matchUrlPath } from "../utils/url";
import { posts } from "./fixture";
import type { Post, PostsResponse } from "./type";

function* nextIdGenerator() {
  let id = Math.max(...posts.map((p) => p.id)) + 1;
  while (true) {
    yield id++;
  }
}
const nextIdIter = nextIdGenerator();
const nextId = () => nextIdIter.next().value!;

export const handlePostsMock = (
  res: ServerResponse,
  pathname: string,
  method: string,
  url: string,
  body?: string,
) => {
  if (pathname === "/posts") {
    switch (method) {
      case "GET": {
        const queryParams = parseQueryParams(url);
        const limitParam = queryParams.limit;
        const skipParam = queryParams.skip;

        const skip = Math.max(0, Number.parseInt(skipParam || "0", 10) || 0);
        const limit = Math.max(
          0,
          Number.parseInt(limitParam || "10", 10) || 10,
        );

        const postsResponse = createPostsResponse(skip, limit);
        sendJsonResponse(res, 200, postsResponse);
        return;
      }

      case "POST": {
        const newPost = parseJsonBody(body, {});
        if (!newPost) {
          sendErrorResponse(res, 400, "Invalid JSON");
          return;
        }

        if (!validatePostData(newPost)) {
          sendErrorResponse(res, 400, "title and body are required");
          return;
        }

        const post: Post = {
          id: nextId(),
          title: newPost.title,
          body: newPost.body,
        };
        posts.push(post);

        sendJsonResponse(res, 201, post);
        return;
      }

      default:
        sendErrorResponse(res, 405, "Method not allowed");
        return;
    }
  }

  if (matchUrlPath("/posts/:postId", pathname)) {
    const params = extractPathParams("/posts/:postId", pathname);
    const postId = Number.parseInt(params.postId || "0", 10);
    const postIndex = posts.findIndex((p) => p.id === postId);

    switch (method) {
      case "GET": {
        if (postIndex === -1) {
          sendErrorResponse(res, 404, "Post not found");
          return;
        }

        sendJsonResponse(res, 200, posts[postIndex]);
        return;
      }

      case "PUT": {
        const updatedPost = parseJsonBody(body, {});
        if (!updatedPost) {
          sendErrorResponse(res, 400, "Invalid JSON");
          return;
        }

        if (postIndex === -1) {
          sendErrorResponse(res, 404, "Post not found");
          return;
        }

        if (!validatePostData(updatedPost)) {
          sendErrorResponse(res, 400, "title and body are required");
          return;
        }

        const existingPost = posts[postIndex]!;
        posts[postIndex] = {
          ...existingPost,
          title: updatedPost.title,
          body: updatedPost.body,
        };

        sendJsonResponse(res, 200, posts[postIndex]);
        return;
      }

      case "DELETE": {
        if (postIndex === -1) {
          sendErrorResponse(res, 404, "Post not found");
          return;
        }

        posts.splice(postIndex, 1);
        res.writeHead(204);
        res.end();
        return;
      }

      default:
        sendErrorResponse(res, 405, "Method not allowed");
        return;
    }
  }

  sendErrorResponse(res, 404, "Not found");
};

const sendJsonResponse = (
  res: ServerResponse,
  statusCode: number,
  data: unknown,
) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};

const sendErrorResponse = (
  res: ServerResponse,
  statusCode: number,
  message: string,
) => {
  sendJsonResponse(res, statusCode, { error: message });
};

const createPostsResponse = (skip: number, limit: number): PostsResponse => ({
  posts: posts.slice(skip, skip + limit),
  total: posts.length,
  skip: skip,
  limit: limit,
});

const parseJsonBody = <T>(
  body: string | undefined,
  defaultValue: T,
): T | null => {
  try {
    return JSON.parse(body || JSON.stringify(defaultValue));
  } catch {
    return null;
  }
};

const validatePostData = (
  post: unknown,
): post is { title: string; body: string } => {
  if (typeof post !== "object" || post === null) {
    return false;
  }

  const obj = post as Record<string, unknown>;
  return (
    typeof obj.title === "string" &&
    typeof obj.body === "string" &&
    obj.title.trim() !== "" &&
    obj.body.trim() !== ""
  );
};

const parseQueryParams = (url: string): Record<string, string> => {
  const queryStart = url.indexOf("?");
  if (queryStart === -1) return {};

  const queryString = url.slice(queryStart + 1);
  const params: Record<string, string> = {};

  for (const param of queryString.split("&")) {
    const [key, value] = param.split("=");
    if (key && value !== undefined) {
      params[decodeURIComponent(key)] = decodeURIComponent(value);
    }
  }

  return params;
};
