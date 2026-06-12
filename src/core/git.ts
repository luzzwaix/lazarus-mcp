import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { runCommand } from "./runner.js";
import type { ScanResult } from "../types.js";

const GIT_SCAN: ScanResult = {
  path: "",
  stack: "unsupported",
  packageManager: null,
  configFiles: [],
  scripts: {},
  testRunnerHints: [],
  confidence: 0,
  healthHints: []
};

export async function createLocalBranch(root: string, branchName: string): Promise<boolean> {
  if (!existsSync(join(root, ".git"))) return false;
  await runCommand({ cwd: root, stage: "build", command: "git", args: ["checkout", "-B", branchName], timeoutMs: 30_000 }, GIT_SCAN);
  return true;
}

export async function writeGitDiff(root: string, outputPath: string): Promise<string | null> {
  if (!existsSync(join(root, ".git"))) return null;
  const result = await runCommand({ cwd: root, stage: "build", command: "git", args: ["diff"], timeoutMs: 30_000 }, GIT_SCAN);
  writeFileSync(outputPath, result.stdout, "utf8");
  return outputPath;
}
