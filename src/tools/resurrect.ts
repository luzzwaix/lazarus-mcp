import { existsSync, mkdirSync } from "node:fs";
import { basename, join } from "node:path";
import { createLocalBranch, writeGitDiff } from "../core/git.js";
import { isPipelineGreen } from "../core/metrics.js";
import { patchEsmCjs } from "../playbooks/node/patchEsmCjs.js";
import { patchMissingDeps } from "../playbooks/node/patchMissingDeps.js";
import { patchPackageJson } from "../playbooks/node/patchPackageJson.js";
import { patchRequirements } from "../playbooks/python/patchRequirements.js";
import { resolveWorkspaceTarget, type WorkspaceOptions } from "../core/workspace.js";
import type { AppliedFix, ResurrectionResult } from "../types.js";
import { autopsyLocalPath } from "./autopsy.js";

export interface ResurrectOptions {
  safe?: boolean;
  branch?: string;
  workspace?: WorkspaceOptions;
}

export async function resurrect(path: string, options: ResurrectOptions = {}): Promise<ResurrectionResult> {
  const branchName = options.branch ?? "feat/lazarus-mvp";
  const target = await resolveWorkspaceTarget(path, options.workspace);
  const before = await autopsyLocalPath(target.path);
  const branchCreated = await createLocalBranch(before.scan.path, branchName);
  const appliedFixes: AppliedFix[] = [];

  if (!isPipelineGreen(before.beforeMetrics)) {
    if (before.scan.stack === "node") {
      appliedFixes.push(...patchEsmCjs(before.scan.path, before));
      appliedFixes.push(...patchPackageJson(before.scan.path, before));
      appliedFixes.push(...patchMissingDeps(before.scan.path, before));
    }
    if (before.scan.stack === "python") {
      appliedFixes.push(...patchRequirements(before.scan.path, before));
    }
  }

  const after = await autopsyLocalPath(target.path);
  const diffPath = join(before.scan.path, "evidence", "lazarus.diff");
  if (existsSync(join(before.scan.path, ".git"))) mkdirSync(join(before.scan.path, "evidence"), { recursive: true });
  const gitDiffPath = await writeGitDiff(before.scan.path, diffPath);

  return {
    branchName,
    branchCreated,
    before,
    after,
    appliedFixes,
    changedFiles: [...new Set(appliedFixes.map((fix) => fix.file))],
    gitDiffPath,
  };
}

export function fixtureName(path: string): string {
  return basename(path);
}
