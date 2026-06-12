import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { EvidenceSummary, ResurrectionResult } from "../types.js";

export function writeResurrectionReport(root: string, result: ResurrectionResult): string {
  const file = join(root, "RESURRECTION_REPORT.md");
  writeFileSync(file, renderResurrectionReport(result), "utf8");
  return file;
}

export function writeAiJudges(root: string, result: ResurrectionResult): string {
  const file = join(root, "AI_JUDGES.md");
  writeFileSync(file, renderAiJudges(result), "utf8");
  return file;
}

export function writeEvidenceSummary(root: string, summary: EvidenceSummary): string {
  mkdirSync(join(root, "evidence"), { recursive: true });
  const file = join(root, "evidence", "summary.json");
  writeFileSync(file, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  return file;
}

export function renderResurrectionReport(result: ResurrectionResult): string {
  const fixes = result.appliedFixes.length
    ? result.appliedFixes.map((fix) => `- ${fix.id}: ${fix.description} (${fix.file})`).join("\n")
    : "- No safe automatic fix was applied.";
  return `# Resurrection Report

## Problem Statement
Lazarus MCP inspects a broken Node/Python repository, classifies the failing install/build/test phase, applies high-confidence playbooks, reruns the pipeline, and writes judge-readable evidence.

## Before State
| Phase | Status |
| --- | --- |
| install | ${result.before.beforeMetrics.install} |
| build | ${result.before.beforeMetrics.build} |
| test | ${result.before.beforeMetrics.test} |

## Autopsy Findings
- Stack: ${result.before.scan.stack}
- Failure stage: ${result.before.failStage ?? "none"}
- Error classes: ${result.before.errorClasses.join(", ") || "none"}
- Suggested playbooks: ${result.before.suggestedPlaybooks.join(", ") || "none"}

## Applied Fixes
${fixes}

## After State
| Phase | Status |
| --- | --- |
| install | ${result.after.beforeMetrics.install} |
| build | ${result.after.beforeMetrics.build} |
| test | ${result.after.beforeMetrics.test} |

## Metrics
- Before duration: ${result.before.beforeMetrics.durationMs}ms
- After duration: ${result.after.beforeMetrics.durationMs}ms
- Branch: ${result.branchName}${result.branchCreated ? "" : " (not created; target is not a git repo)"}

## Changed Files
${result.changedFiles.length ? result.changedFiles.map((file) => `- ${file}`).join("\n") : "- None"}

## Remaining Limitations
- MVP scope is intentionally limited to Node and Python.
- Playbooks only mutate files when confidence is high.
- Lazarus never pushes branches or modifies remotes.
`;
}

export function renderAiJudges(result: ResurrectionResult): string {
  return `# AI Judges

Lazarus MCP is a CLI-first TypeScript project with a thin stdio MCP adapter. It scans a local Node/Python repository, runs install/build/test autopsy, applies conservative resurrection playbooks, reruns the pipeline, and generates evidence.

## Main Evidence
- README.md explains the product, quickstart, CLI, MCP tools, demo flow, and safety policy.
- RESURRECTION_REPORT.md shows before state, autopsy findings, applied fixes, after state, metrics, changed files, and limitations.
- evidence/summary.json is the machine-readable judge pack.
- tests/ contains unit and fixture-based resurrection coverage.

## Fixture Proof
- fixtures/dead-node-esm-cjs proves conservative ESM/CJS repair.
- fixtures/dead-node-missing-build proves missing script repair.
- fixtures/dead-python-missing-pytest proves Python pytest dependency repair.

## Current Run
- Target stack: ${result.before.scan.stack}
- Before: install=${result.before.beforeMetrics.install}, build=${result.before.beforeMetrics.build}, test=${result.before.beforeMetrics.test}
- After: install=${result.after.beforeMetrics.install}, build=${result.after.beforeMetrics.build}, test=${result.after.beforeMetrics.test}
- Applied fixes: ${result.appliedFixes.map((fix) => fix.id).join(", ") || "none"}

## Known MVP Limitations
- Node and Python only.
- Local path input first; git URL cloning is deliberately out of MVP scope.
- No remote HTTP server, OAuth, or frontend.
`;
}
