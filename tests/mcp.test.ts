import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { handleRequest } from "../src/mcp/protocol.js";
import { fixturePath } from "./helpers.js";

const children = new Set<ReturnType<typeof spawn>>();

afterEach(() => {
  for (const child of children) child.kill();
  children.clear();
});

describe("MCP protocol", () => {
  it("negotiates initialization", async () => {
    const response = await handleRequest({ jsonrpc: "2.0", id: 1, method: "initialize", params: {} });

    expect(response).toMatchObject({
      jsonrpc: "2.0",
      id: 1,
      result: {
        protocolVersion: "2024-11-05",
        serverInfo: { name: "lazarus-mcp", version: "0.1.0" }
      }
    });
  });

  it("lists the complete four-tool surface", async () => {
    const response = await handleRequest({ jsonrpc: "2.0", id: 2, method: "tools/list" });
    const result = response as { result: { tools: Array<{ name: string }> } };
    const names = result.result.tools.map((tool) => tool.name);

    expect(names).toEqual(["scan_repo", "autopsy", "resurrect", "evidence_pack"]);
  });

  it("calls scan_repo through JSON-RPC", async () => {
    const response = await handleRequest({
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: { name: "scan_repo", arguments: { path: fixturePath("dead-node-missing-build") } }
    });
    const resultResponse = response as { result: { content: Array<{ text: string }> } };
    const text = resultResponse.result.content[0].text;
    const result = JSON.parse(text) as { stack: string };

    expect(result.stack).toBe("node");
  });

  it("rejects unknown tools without executing them", async () => {
    const response = await handleRequest({
      jsonrpc: "2.0",
      id: 4,
      method: "tools/call",
      params: { name: "delete_everything", arguments: {} }
    });

    expect(response).toEqual({
      jsonrpc: "2.0",
      id: 4,
      error: { code: -32602, message: "Invalid tool call" }
    });
  });

  it("serves a real stdio initialize and tools/list session", async () => {
    const child = spawn(process.execPath, ["--import", "tsx", resolve("src/server.ts")], {
      cwd: resolve("."),
      stdio: ["pipe", "pipe", "pipe"]
    });
    children.add(child);

    const responses = await collectResponses(child, [
      { jsonrpc: "2.0", id: 1, method: "initialize", params: {} },
      { jsonrpc: "2.0", id: 2, method: "tools/list", params: {} }
    ]);

    expect(responses[0]).toMatchObject({ id: 1, result: { serverInfo: { name: "lazarus-mcp" } } });
    expect(responses[1].result.tools).toHaveLength(4);
  });
});

function collectResponses(
  child: ReturnType<typeof spawn>,
  requests: Array<Record<string, unknown>>
): Promise<Array<Record<string, any>>> {
  return new Promise((resolvePromise, reject) => {
    let buffer = "";
    const responses: Array<Record<string, any>> = [];
    const timer = setTimeout(() => reject(new Error("Timed out waiting for MCP stdio responses")), 8_000);

    child.on("error", reject);
    child.stderr!.on("data", (chunk) => {
      const message = chunk.toString().trim();
      if (message) reject(new Error(message));
    });
    child.stdout!.on("data", (chunk) => {
      buffer += chunk.toString();
      for (;;) {
        const newline = buffer.indexOf("\n");
        if (newline < 0) break;
        const line = buffer.slice(0, newline).trim();
        buffer = buffer.slice(newline + 1);
        if (line) responses.push(JSON.parse(line));
        if (responses.length === requests.length) {
          clearTimeout(timer);
          resolvePromise(responses);
        }
      }
    });

    for (const request of requests) child.stdin!.write(`${JSON.stringify(request)}\n`);
  });
}
