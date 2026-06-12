import { existsSync, realpathSync } from "node:fs";
import { resolve } from "node:path";

const SECRET_PATTERNS = [
  /(api[_-]?key|token|secret|password)\s*[:=]\s*["']?[^"'\s]+/gi,
  /(sk-[A-Za-z0-9_-]{16,})/g,
  /(ghp_[A-Za-z0-9_]{16,})/g
];

export function resolveTargetPath(inputPath: string): string {
  const resolved = resolve(inputPath);
  if (!existsSync(resolved)) {
    throw new Error(`Target path does not exist: ${resolved}`);
  }
  return realpathSync(resolved);
}

export function redactSecrets(value: string): string {
  return SECRET_PATTERNS.reduce(
    (text, pattern) => text.replace(pattern, "[REDACTED]"),
    value
  );
}

export function truncateLog(value: string, maxChars = 6000): string {
  const clean = redactSecrets(value);
  return clean.length <= maxChars ? clean : `${clean.slice(0, maxChars)}\n[truncated]`;
}
