import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  type CallToolRequest,
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { formatA11yResults } from "./formatter.js";
import {
  generateStorybookUrl,
  getStorybookA11yTree,
  getStorybookScreenshot,
} from "./storybook.js";

const server = new Server(
  {
    name: "storybook-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

const tools: Tool[] = [
  {
    name: "get_storybook_a11y_tree",
    description: "Get accessibility tree from Storybook URL",
    inputSchema: {
      type: "object",
      properties: {
        host: {
          type: "string",
          description: "Storybook host URL (e.g., http://localhost:6006)",
          default: "http://localhost:6006",
        },
        title: {
          type: "string",
          description: "Story title (e.g., MyTest/SomeText)",
        },
        storyName: {
          type: "string",
          description: "Story name (e.g., Default)",
        },
        timeout: {
          type: "number",
          description: "Timeout in milliseconds (default: 30000)",
          default: 30000,
        },
      },
      required: ["title", "storyName"],
    },
  },
  {
    name: "get_storybook_screenshot",
    description: "Take a screenshot of a Storybook story",
    inputSchema: {
      type: "object",
      properties: {
        host: {
          type: "string",
          description: "Storybook host URL (e.g., http://localhost:6006)",
          default: "http://localhost:6006",
        },
        title: {
          type: "string",
          description: "Story title (e.g., MyTest/SomeText)",
        },
        storyName: {
          type: "string",
          description: "Story name (e.g., Default)",
        },
        timeout: {
          type: "number",
          description: "Timeout in milliseconds (default: 30000)",
          default: 30000,
        },
      },
      required: ["title", "storyName"],
    },
  },
];

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

server.setRequestHandler(
  CallToolRequestSchema,
  async (request: CallToolRequest) => {
    const { name, arguments: args } = request.params;

    if (name === "get_storybook_a11y_tree") {
      const {
        host,
        title,
        storyName,
        timeout = 30000,
      } = args as {
        host: string;
        title: string;
        storyName: string;
        timeout?: number;
      };

      try {
        const url = generateStorybookUrl(
          host || "http://localhost:6006",
          title,
          storyName,
        );
        const a11yResults = await getStorybookA11yTree(url, timeout);
        const formattedResults = formatA11yResults(a11yResults);

        return {
          content: [
            {
              type: "text",
              text: `Accessibility analysis for ${title}/${storyName} (${url}):\n\n${formattedResults}`,
            },
            {
              type: "text",
              text: `Raw accessibility tree data:\n\n${JSON.stringify(a11yResults, null, 2)}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error getting accessibility analysis: ${error}`,
            },
          ],
          isError: true,
        };
      }
    }

    if (name === "get_storybook_screenshot") {
      const {
        host,
        title,
        storyName,
        timeout = 30000,
      } = args as {
        host: string;
        title: string;
        storyName: string;
        timeout?: number;
      };

      try {
        const url = generateStorybookUrl(
          host || "http://localhost:6006",
          title,
          storyName,
        );
        const screenshot = await getStorybookScreenshot(url, timeout);

        // Convert Buffer to base64 string
        const base64Screenshot = screenshot.toString("base64");

        return {
          content: [
            {
              type: "text",
              text: `Screenshot captured for ${title}/${storyName} (${url})`,
            },
            {
              type: "image",
              data: base64Screenshot,
              mimeType: "image/png",
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error taking screenshot: ${error}`,
            },
          ],
          isError: true,
        };
      }
    }

    throw new Error(`Unknown tool: ${name}`);
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Storybook A11y MCP Server is running");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
