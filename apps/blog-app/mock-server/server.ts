import { type IncomingMessage, createServer } from "node:http";
import { URL } from "node:url";
import { handlePostsMock } from "./handlers/posts";
import { logRequest } from "./utils/logger";
import { sendJsonResponse } from "./utils/response";

const PORT = 3001;

const server = createServer(async (req, res) => {
  const url = new URL(req.url!, `http://localhost:${PORT}`);
  const pathname = url.pathname;
  const method = req.method || "GET";

  logRequest(method, req.url!, req.headers);

  // Handle CORS preflight requests
  if (method === "OPTIONS") {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    });
    res.end();
    return;
  }

  // Posts API routes
  if (pathname.startsWith("/posts")) {
    const body = await readBody(req);
    handlePostsMock(res, pathname, method, body || undefined);
    return;
  }

  // 404 Not Found
  sendJsonResponse(res, { error: "Not Found" }, 404);
});

server.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
});

export default server;

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      resolve(body);
    });
  });
}
