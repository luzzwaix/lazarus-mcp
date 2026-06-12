import { mkdirSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { runCommand } from "./runner.js";
import { resolveTargetPath } from "./safety.js";
import type { ScanResult } from "../types.js";

export interface GitHubRepoUrl {
  owner: string;
  repo: string;
  normalizedUrl: string;
}

export interface WorkspaceTarget {
  input: string;
  path: string;
  source: "local" | "github";
  repo?: GitHubRepoUrl;
}

export type CloneRunner = (url: string, targetPath: string) => Promise<void>;

export interface WorkspaceOptions {
  workspaceRoot?: string;
  now?: Date;
  cloneRunner?: CloneRunner;
}

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

export async function resolveWorkspaceTarget(
  input: string,
  options: WorkspaceOptions = {}
): Promise<WorkspaceTarget> {
  const repo = parseGitHubHttpsUrl(input);
  if (!repo) {
    return {
      input,
      path: resolveTargetPath(input),
      source: "local"
    };
  }

  const workspaceRoot = options.workspaceRoot ?? resolve(".lazarus-workspaces");
  const targetPath = cloneTargetPath(repo, options.now ?? new Date(), workspaceRoot);
  mkdirSync(workspaceRoot, { recursive: true });
  await (options.cloneRunner ?? cloneGitHubRepo)(repo.normalizedUrl, targetPath);

  return {
    input,
    path: targetPath,
    source: "github",
    repo
  };
}

export function parseGitHubHttpsUrl(input: string): GitHubRepoUrl | null {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || url.hostname.toLowerCase() !== "github.com") return null;
  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length !== 2) return null;
  const [owner, rawRepo] = parts;
  const repo = rawRepo?.replace(/\.git$/i, "");
  if (!owner || !repo || !/^[A-Za-z0-9_.-]+$/.test(owner) || !/^[A-Za-z0-9_.-]+$/.test(repo)) {
    return null;
  }
  return {
    owner,
    repo,
    normalizedUrl: `https://github.com/${owner}/${repo}.git`
  };
}

export function cloneTargetPath(repo: GitHubRepoUrl, now: Date, workspaceRoot = resolve(".lazarus-workspaces")) {
  return join(workspaceRoot, `${basename(repo.repo)}-${formatTimestamp(now)}`);
}

export async function cloneGitHubRepo(url: string, targetPath: string): Promise<void> {
  const result = await runCommand(
    {
      cwd: process.cwd(),
      stage: "install",
      command: "git",
      args: ["clone", "--no-tags", url, targetPath],
      timeoutMs: 180_000
    },
    GIT_SCAN
  );
  if (result.status !== "passed") {
    throw new Error(`git clone failed for ${url}: ${result.stderr || result.stdout || result.summary}`);
  }
}

export function formatTimestamp(now: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return [
    now.getUTCFullYear(),
    pad(now.getUTCMonth() + 1),
    pad(now.getUTCDate()),
    "T",
    pad(now.getUTCHours()),
    pad(now.getUTCMinutes()),
    pad(now.getUTCSeconds())
  ].join("");
}
