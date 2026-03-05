/**
 * Convert Qoder session JSONL to readable Markdown.
 * Usage: node scripts/jsonl-to-md.js [input.jsonl] [output.md]
 */
const fs = require("fs");
const path = require("path");

const inputPath =
  process.argv[2] ||
  path.join(
    process.env.APPDATA || "",
    "Qoder/SharedClientCache/cli/projects/d--Workspace-AI-conversation-demo/task-d6kghd7ou9m24cb7e7h0.session.execution.jsonl"
  );
const outputPath = process.argv[3] || path.join(__dirname, "..", "chat-export.md");

const lines = fs.readFileSync(inputPath, "utf-8").split("\n").filter(Boolean);

let md = "# Qoder Chat History\n\n";
let lastRole = "";

for (const line of lines) {
  let entry;
  try {
    entry = JSON.parse(line);
  } catch {
    continue;
  }

  const { type, message, timestamp } = entry;
  if (!message || !message.content || !Array.isArray(message.content)) continue;

  const role = type === "user" ? "user" : "assistant";

  for (const block of message.content) {
    // Skip thinking blocks, tool results, and tool use blocks
    if (block.type === "thinking") continue;
    if (block.type === "tool_result") continue;
    if (block.type === "tool_use") continue;

    if (block.type === "text" && block.text && block.text.trim()) {
      const text = block.text.trim();

      // Skip system reminders
      if (text.startsWith("<system-reminder>")) continue;
      // Skip empty/whitespace-only
      if (!text) continue;

      const time = timestamp
        ? new Date(timestamp).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })
        : "";

      const label = role === "user" ? "👤 用户" : "🤖 Qoder";

      // Only print header if role changed
      if (role !== lastRole) {
        md += `---\n\n### ${label}${time ? `  \`${time}\`` : ""}\n\n`;
        lastRole = role;
      }

      md += text + "\n\n";
    }
  }
}

fs.writeFileSync(outputPath, md, "utf-8");
console.log(`Exported to: ${outputPath}`);
console.log(`Total lines processed: ${lines.length}`);
