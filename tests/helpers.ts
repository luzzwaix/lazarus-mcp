import { cpSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

export function fixturePath(name: string): string {
  return resolve("fixtures", name);
}

export function copyFixture(name: string): string {
  const target = mkdtempSync(join(tmpdir(), `lazarus-${name}-`));
  cpSync(fixturePath(name), target, { recursive: true });
  return target;
}
