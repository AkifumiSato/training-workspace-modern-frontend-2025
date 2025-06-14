import type { A11yNode } from "./types.js";

export function formatA11yResults(results: A11yNode): string {
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

  output += formatNode(results);

  return output;
}
