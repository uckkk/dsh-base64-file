// dsh-base64-file — base64 文件转换（DeepSeek Harness）。
// 文件 ↔ base64（含 data URL），用于图片嵌入 HTML/JSON 等。纯 Node。
import { defineTool } from "@deepseek-ai/dsh-tools";
import { readFile, writeFile } from "node:fs/promises";

const name = "Base64 文件";
const inject = ["tools"];

const MIME = {
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif",
  ".webp": "image/webp", ".svg": "image/svg+xml", ".ico": "image/x-icon",
  ".pdf": "application/pdf", ".txt": "text/plain", ".md": "text/markdown",
  ".json": "application/json", ".html": "text/html", ".css": "text/css", ".js": "text/javascript",
  ".woff": "font/woff", ".woff2": "font/woff2", ".ttf": "font/ttf",
  ".mp3": "audio/mpeg", ".mp4": "video/mp4", ".wav": "audio/wav",
};

function mimeOf(file) {
  const ext = file.includes(".") ? "." + file.split(".").pop().toLowerCase() : "";
  return MIME[ext] || "application/octet-stream";
}

async function apply(ctx, _config) {
  ctx.tools.register(defineTool({
    name: "file_to_base64",
    description:
      "把文件转成 base64 字符串或 data URL（含 MIME 类型，可直接嵌入 HTML/img 或 JSON）。`file` 传文件路径；`dataUrl` 默认 true 返回 data:...;base64,... 形式，false 返回纯 base64。",
    parameters: {
      file: { type: "string", required: true, description: "文件路径。" },
      dataUrl: { type: "boolean", description: "是否返回 data URL，默认 true。" },
    },
    output: {
      schema: {
        type: "object", additionalProperties: false,
        properties: { mime: { type: "string", required: true }, base64: { type: "string", required: true }, size: { type: "integer", required: true } },
      },
      render: (_args, value) => [{ type: "text", text: `${value.mime}（${value.size} 字节）\n${value.base64.slice(0, 2000)}${value.base64.length > 2000 ? "\n…（截断）" : ""}` }],
    },
    execute: async (args) => {
      const buf = await readFile(args.file);
      const b64 = buf.toString("base64");
      const mime = mimeOf(args.file);
      const out = args.dataUrl === false ? b64 : `data:${mime};base64,${b64}`;
      return { mime, base64: out, size: buf.length };
    },
  }));

  ctx.tools.register(defineTool({
    name: "base64_to_file",
    description:
      "把 base64 字符串（或 data URL）解码并写入文件。`base64` 传 base64 或 data URL；`outFile` 传输出路径（扩展名决定格式）。",
    parameters: {
      base64: { type: "string", required: true, description: "base64 字符串或 data URL。" },
      outFile: { type: "string", required: true, description: "输出文件路径。" },
    },
    output: {
      schema: { type: "object", additionalProperties: false, properties: { file: { type: "string", required: true }, size: { type: "integer", required: true } } },
      render: (_args, value) => [{ type: "text", text: `已写入 ${value.file}（${value.size} 字节）` }],
    },
    execute: async (args) => {
      let b64 = String(args.base64).trim();
      if (b64.includes(",")) b64 = b64.slice(b64.indexOf(",") + 1);
      const buf = Buffer.from(b64, "base64");
      await writeFile(args.outFile, buf);
      return { file: args.outFile, size: buf.length };
    },
  }));
}

export { apply, inject, name };
