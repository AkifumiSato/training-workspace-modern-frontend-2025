import kebabCase from "just-kebab-case";
import { chromium } from "playwright";
import type { A11yNode, AXNode, AccessibilityTreeResponse } from "./types.js";

export function generateStorybookUrl(
  host: string,
  title: string,
  storyName: string,
): string {
  // Convert title: MyTest/SomeText -> mytest-sometext
  const convertedTitle = title
    .toLowerCase()
    .replace(/\//g, "-")
    .replace(/\s+/g, "");

  // Convert story name from camelCase to kebab-case: MyStoryName -> my-story-name
  const convertedStoryName = kebabCase(storyName);

  // Generate the id: mytest-sometext--my-story-name
  const id = `${convertedTitle}--${convertedStoryName}`;

  return `${host}/iframe.html?globals=&args=&id=${id}&viewMode=story`;
}

export async function getStorybookA11yTree(
  url: string,
  timeout = 30000,
): Promise<A11yNode> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to the Storybook iframe
    await page.goto(url, { waitUntil: "networkidle", timeout });

    // Wait for the story to load
    await page.waitForSelector("body", { timeout });

    // CDP セッションを取得 (Chromium 専用)
    const client = await page.context().newCDPSession(page);

    // Accessibility ドメインのコマンドを実行（型安全）
    const response = (await client.send(
      "Accessibility.getFullAXTree",
    )) as AccessibilityTreeResponse;

    // AXNode配列をA11yNodeツリーに変換
    const a11yTree = convertAXNodesToA11yTree(response.nodes);

    return a11yTree;
  } catch (error) {
    console.error("Error getting accessibility tree:", error);
    throw error;
  } finally {
    await browser.close();
  }
}

function convertAXNodesToA11yTree(nodes: AXNode[]): A11yNode {
  if (nodes.length === 0) {
    return { role: "unknown", name: "", children: [] };
  }

  const nodeMap = new Map<string, AXNode>();
  for (const node of nodes) {
    nodeMap.set(node.nodeId, node);
  }

  // AXNodeをA11yNodeに変換
  function convertNode(axNode: AXNode): A11yNode {
    const a11yNode: A11yNode = {
      role: axNode.role?.value || "unknown",
      name: axNode.name?.value || "",
      value: axNode.value?.value || undefined,
      description: axNode.description?.value || undefined,
      children: [],
    };

    // 子ノードを再帰的に変換
    if (axNode.childIds && axNode.childIds.length > 0) {
      a11yNode.children = axNode.childIds
        .map((childId: string) => nodeMap.get(childId))
        .filter((child): child is AXNode => child !== undefined)
        .map((child: AXNode) => convertNode(child));
    }

    return a11yNode;
  }

  // ルートノードを見つける（parentIdがないノード）
  const rootNodes = nodes.filter((node) => !node.parentId);

  if (rootNodes.length === 0) {
    // ルートノードが見つからない場合は最初のノードを使用
    const firstNode = nodes[0];
    if (!firstNode) {
      return { role: "unknown", name: "Empty tree", children: [] };
    }
    return convertNode(firstNode);
  }

  const firstRootNode = rootNodes[0];
  if (rootNodes.length === 1 && firstRootNode) {
    return convertNode(firstRootNode);
  }

  // 複数のルートノードがある場合は、仮想ルートを作成
  return {
    role: "WebArea",
    name: "Document",
    children: rootNodes.map((node) => convertNode(node)),
  };
}
