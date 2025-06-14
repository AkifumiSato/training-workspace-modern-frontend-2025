#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  type CallToolRequest,
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { type Page, chromium } from "playwright";

type AccessibilitySnapshot = Awaited<
  ReturnType<Page["accessibility"]["snapshot"]>
>;

type A11yNode = {
  role?: string;
  name?: string;
  value?: string;
  description?: string;
  children?: A11yNode[];
  [key: string]: unknown;
};

const server = new Server(
  {
    name: "storybook-a11y-mcp",
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
];

function generateStorybookUrl(
  host: string,
  title: string,
  storyName: string,
): string {
  // Convert title: MyTest/SomeText -> mytest-sometext
  const convertedTitle = title
    .toLowerCase()
    .replace(/\//g, "-")
    .replace(/\s+/g, "");

  // Convert story name: Default -> default
  const convertedStoryName = storyName.toLowerCase().replace(/\s+/g, "");

  // Generate the id: mytest-sometext--default
  const id = `${convertedTitle}--${convertedStoryName}`;

  return `${host}/iframe.html?globals=&args=&id=${id}&viewMode=story`;
}

async function getStorybookA11yTree(
  url: string,
  timeout = 30000,
): Promise<AccessibilitySnapshot> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to the Storybook iframe
    await page.goto(url, { waitUntil: "networkidle", timeout });

    // Wait for the story to load
    await page.waitForSelector("body", { timeout });

    // Get accessibility analysis using page.accessibility.snapshot()
    const accessibilityResults = await page.accessibility.snapshot();

    return accessibilityResults;
  } catch (error) {
    console.error("Error getting accessibility tree:", error);
    throw error;
  } finally {
    await browser.close();
  }
}

function formatA11yResults(results: AccessibilitySnapshot): string {
  if (!results) {
    return "❌ No accessibility tree found";
  }

  let output = "🌳 ACCESSIBILITY TREE:\n\n";

  function formatNode(node: A11yNode, depth = 0): string {
    const indent = "  ".repeat(depth);
    let nodeOutput = `${indent}• ${node.role || "unknown"}`;

    if (node.name) {
      nodeOutput += ` "${node.name}"`;
    }

    if (node.value) {
      nodeOutput += ` (value: "${node.value}")`;
    }

    if (node.description) {
      nodeOutput += ` - ${node.description}`;
    }

    nodeOutput += "\n";

    // Add children
    if (node.children && node.children.length > 0) {
      nodeOutput += node.children
        .map((child: A11yNode) => formatNode(child, depth + 1))
        .join("");
    }

    return nodeOutput;
  }

  output += formatNode(results as A11yNode);

  return output;
}

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
