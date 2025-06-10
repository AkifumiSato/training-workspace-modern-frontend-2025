import type { ServerResponse } from "node:http";
import { extractPathParams, matchUrlPath } from "../utils/url";

const posts = [
  {
    id: 1,
    title: "Server Componentsでデータフェッチを最適化する",
    body: "Next.js App RouterのServer Componentsを活用することで、サーバーサイドでのデータフェッチが可能になります。従来のuseEffectを使ったクライアントサイドでのデータ取得と比較して、初期表示速度の向上とSEO対策の観点から大きなメリットがあります。実際のコード例を交えて、効率的なデータフェッチパターンを解説します。",
  },
  {
    id: 2,
    title: "データフェッチのコロケーション設計で保守性を向上させる",
    body: "データフェッチロジックをコンポーネントの近くに配置するコロケーションパターンについて解説します。従来のカスタムフックやコンテナコンポーネントと比較して、Server Componentsではより直感的なデータフェッチが可能です。実際のプロジェクトでの適用例とメリット・デメリットを詳しく説明します。",
  },
  {
    id: 3,
    title: "Request Memoizationで無駄なAPIコールを削減する",
    body: "Next.jsのRequest Memoization機能を使用することで、同じリクエスト内での重複したデータフェッチを自動的に最適化できます。React.cacheを使った実装方法や、どのような場面で効果を発揮するのか、実際のパフォーマンス測定結果とともに詳しく解説します。",
  },
  {
    id: 4,
    title: "並行データフェッチでページ読み込み速度を劇的に改善する",
    body: "複数のAPIを並行して呼び出すことで、ページの読み込み時間を大幅に短縮できます。Promise.allを使った実装方法から、Suspenseとの組み合わせパターン、エラーハンドリングの考慮点まで、実践的な並行データフェッチの手法を網羅的に説明します。",
  },
  {
    id: 5,
    title: "N+1問題をDataLoaderパターンで解決する",
    body: "GraphQLでよく知られるN+1問題は、REST APIでも発生する深刻なパフォーマンス問題です。DataLoaderパターンを使用してバッチ処理を実装することで、この問題を効率的に解決できます。Next.jsでの具体的な実装例と、パフォーマンス改善の測定結果を紹介します。",
  },
  {
    id: 6,
    title: "Client Componentsの適切なユースケースと設計指針",
    body: "Next.js App RouterにおけるClient Componentsの使い分けについて詳しく解説します。'use client'ディレクティブを使用する適切なタイミング、Server ComponentsとClient Componentsの境界設計、パフォーマンスへの影響を考慮した実装方法を実例とともに説明します。",
  },
  {
    id: 7,
    title: "Compositionパターンで再利用可能なコンポーネントを設計する",
    body: "React/Next.jsにおけるCompositionパターンの実装方法について解説します。Compound Components、Render Props、children関数など、様々なCompositionテクニックを使って、柔軟で再利用性の高いコンポーネントを作成する方法を実際のコード例とともに紹介します。",
  },
  {
    id: 8,
    title: "Full Route CacheとData Cacheを理解してパフォーマンスを最大化する",
    body: "Next.js App Routerの強力なキャッシュ機能について詳しく解説します。Static RenderingとFull Route Cache、Dynamic RenderingとData Cacheの仕組みを理解し、適切な設定でWebアプリケーションのパフォーマンスを最大限に引き出す方法を実践的に説明します。",
  },
  {
    id: 9,
    title: "SuspenseとStreamingで段階的な画面表示を実現する",
    body: "React 18のSuspense機能とNext.jsのStreaming SSRを組み合わせることで、ユーザー体験を大幅に向上させることができます。loading.tsxファイルの活用方法から、細かいローディング状態の制御まで、実際のUIパターンを交えて詳しく解説します。",
  },
  {
    id: 10,
    title: "Server Actionsで安全なフォーム処理とデータ更新を実装する",
    body: "Next.js App RouterのServer Actionsを使用することで、フォーム処理とデータ更新をサーバーサイドで安全に実行できます。従来のAPI Routesとの違い、バリデーション処理の実装、エラーハンドリングのベストプラクティスを実際のフォーム実装例とともに詳しく説明します。",
  },
] satisfies Post[];

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
  body?: string,
) => {
  if (pathname === "/posts") {
    switch (method) {
      case "GET": {
        const postsResponse = createPostsResponse();
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

// Helper functions
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

const createPostsResponse = (): PostsResponse => ({
  posts: posts,
  total: posts.length,
  skip: 0,
  limit: posts.length,
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
