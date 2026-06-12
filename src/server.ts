#!/usr/bin/env node
import { z } from "zod";
import { autopsy } from "./tools/autopsy.js";
import { evidencePack } from "./tools/evidencePack.js";
import { resurrect } from "./tools/resurrect.js";
import { scanRepo } from "./tools/scanRepo.js";

const PathArgs = z.object({ path: z.string().min(1) });
const ResurrectArgs = PathArgs.extend({
  safe: z.boolean().optional(),
  branch: z.string().optional()
});

const tools = {
  scan_repo: {
    description: "Detect Node/Python repository stack, package manager, scripts, test hints, and confidence.",
    schema: PathArgs,
    run: ({ path }: z.infer<typeof PathArgs>) => scanRepo(path)
  },
  autopsy: {
    description: "Run safe install/build/test autopsy and classify failures.",
    schema: PathArgs,
    run: ({ path }: z.infer<typeof PathArgs>) => autopsy(path)
  },
  resurrect: {
    description: "Apply high-confidence resurrection playbooks and rerun the pipeline.",
    schema: ResurrectArgs,
    run: ({ path, safe, branch }: z.infer<typeof ResurrectArgs>) => resurrect(path, { safe, branch })
  },
  evidence_pack: {
    description: "Generate RESURRECTION_REPORT.md, AI_JUDGES.md, and evidence/summary.json.",
    schema: PathArgs,
    run: ({ path }: z.infer<typeof PathArgs>) => evidencePack(path)
  }
};

type ToolName = keyof typeof tools;

type RpcRequest = {
  jsonrpc?: "2.0";
  id?: string | number | null;
  method?: string;
  params?: unknown;
};

let buffer = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  buffer += chunk;
  for (;;) {
    const newline = buffer.indexOf("\n");
    if (newline < 0) return;
    const line = buffer.slice(0, newline).trim();
    buffer = buffer.slice(newline + 1);
    if (line) void handleLine(line);
  }
});

async function handleLine(line: string) {
  try {
    const request = JSON.parse(line) as RpcRequest;
    const response = await handleRequest(request);
    if (response) process.stdout.write(`${JSON.stringify(response)}\n`);
  } catch (error) {
    process.stdout.write(
      `${JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32700, message: String(error) } })}\n`
    );
  }
}

async function handleRequest(request: RpcRequest) {
  if (request.method === "notifications/initialized") return null;
  if (request.method === "initialize") {
    return {
      jsonrpc: "2.0",
      id: request.id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "lazarus-mcp", version: "0.1.0" }
      }
    };
  }
  if (request.method === "tools/list") {
    return {
      jsonrpc: "2.0",
      id: request.id,
      result: {
        tools: Object.entries(tools).map(([name, tool]) => ({
          name,
          description: tool.description,
          inputSchema: zodToTinyJsonSchema(tool.schema)
        }))
      }
    };
  }
  if (request.method === "tools/call") {
    const params = z
      .object({ name: z.string(), arguments: z.unknown().optional() })
      .safeParse(request.params);
    if (!params.success || !isToolName(params.data.name)) {
      return rpcError(request.id, -32602, "Invalid tool call");
    }
    const tool = tools[params.data.name];
    const args = tool.schema.parse(params.data.arguments ?? {});
    const result = await tool.run(args as never);
    return {
      jsonrpc: "2.0",
      id: request.id,
      result: { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] }
    };
  }
  return rpcError(request.id, -32601, `Unknown method: ${request.method}`);
}

function rpcError(id: RpcRequest["id"], code: number, message: string) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

function isToolName(name: string): name is ToolName {
  return Object.prototype.hasOwnProperty.call(tools, name);
}

function zodToTinyJsonSchema(schema: z.ZodObject<z.ZodRawShape>) {
  const shape = schema.shape;
  const properties: Record<string, unknown> = {};
  const required: string[] = [];
  for (const [key, value] of Object.entries(shape)) {
    const isOptional = value instanceof z.ZodOptional;
    const inner = isOptional ? value.unwrap() : value;
    properties[key] = { type: inner instanceof z.ZodBoolean ? "boolean" : "string" };
    if (!isOptional) required.push(key);
  }
  return { type: "object", properties, required };
}
