#!/usr/bin/env node
import { handleRequest, type RpcRequest } from "./mcp/protocol.js";

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
