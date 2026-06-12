import { cpSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { describe, expect, it } from "vitest";
import { isPipelineGreen } from "../src/core/metrics.js";
import { cloneTargetPath, parseGitHubHttpsUrl, resolveWorkspaceTarget } from "../src/core/workspace.js";
import { resurrect } from "../src/tools/resurrect.js";
import { scanRepo } from "../src/tools/scanRepo.js";
import { fixturePath } from "./helpers.js";

describe("GitHub workspace support", () => {
  it("parses GitHub HTTPS URLs and rejects unsupported URL forms", () => {
    expect(parseGitHubHttpsUrl("https://github.com/acme/dead-repo")).toEqual({
      owner: "acme",
      repo: "dead-repo",
      normalizedUrl: "https://github.com/acme/dead-repo.git"
    });
    expect(parseGitHubHttpsUrl("https://github.com/acme/dead-repo.git")?.repo).toBe("dead-repo");
    expect(parseGitHubHttpsUrl("git@github.com:acme/dead-repo.git")).toBeNull();
    expect(parseGitHubHttpsUrl("https://gitlab.com/acme/dead-repo")).toBeNull();
    expect(parseGitHubHttpsUrl("fixtures/dead-node-missing-build")).toBeNull();
  });

  it("generates deterministic clone target paths", () => {
    const repo = parseGitHubHttpsUrl("https://github.com/acme/dead-repo.git");
    expect(repo).not.toBeNull();

    const target = cloneTargetPath(repo!, new Date("2026-06-12T13:14:15Z"), join("tmp", "workspaces"));

    expect(target.replace(/\\/g, "/")).toBe("tmp/workspaces/dead-repo-20260612T131415");
  });

  it("resolves GitHub URLs through an injectable clone runner", async () => {
    const workspaceRoot = mkdtempSync(join(tmpdir(), "lazarus-workspaces-"));
    const calls: Array<{ url: string; targetPath: string }> = [];
    const target = await resolveWorkspaceTarget("https://github.com/acme/dead-repo", {
      workspaceRoot,
      now: new Date("2026-06-12T13:14:15Z"),
      cloneRunner: async (url, targetPath) => {
        calls.push({ url, targetPath });
      }
    });

    expect(target.source).toBe("github");
    expect(target.path).toBe(join(workspaceRoot, "dead-repo-20260612T131415"));
    expect(calls).toEqual([
      {
        url: "https://github.com/acme/dead-repo.git",
        targetPath: target.path
      }
    ]);
  });

  it("scan accepts a GitHub URL when clone is mocked", async () => {
    const workspaceRoot = mkdtempSync(join(tmpdir(), "lazarus-scan-url-"));
    const scan = await scanRepo("https://github.com/acme/dead-node-missing-build", {
      workspaceRoot,
      now: new Date("2026-06-12T13:14:15Z"),
      cloneRunner: async (_url, targetPath) => {
        cpSync(fixturePath("dead-node-missing-build"), targetPath, { recursive: true });
      }
    });

    expect(scan.stack).toBe("node");
    expect(basename(scan.path)).toBe("dead-node-missing-build-20260612T131415");
  });

  it("resurrect accepts a GitHub URL and clones only once", async () => {
    const workspaceRoot = mkdtempSync(join(tmpdir(), "lazarus-resurrect-url-"));
    let cloneCount = 0;
    const result = await resurrect("https://github.com/acme/dead-node-missing-build", {
      safe: true,
      workspace: {
        workspaceRoot,
        now: new Date("2026-06-12T13:14:15Z"),
        cloneRunner: async (_url, targetPath) => {
          cloneCount += 1;
          cpSync(fixturePath("dead-node-missing-build"), targetPath, { recursive: true });
        }
      }
    });

    expect(cloneCount).toBe(1);
    expect(result.before.scan.path).toBe(join(workspaceRoot, "dead-node-missing-build-20260612T131415"));
    expect(result.appliedFixes.map((fix) => fix.id)).toContain("node.add_build_script");
    expect(isPipelineGreen(result.after.beforeMetrics)).toBe(true);
  }, 20_000);
});
