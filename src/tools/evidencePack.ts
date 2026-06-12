import { writeAiJudges, writeEvidenceSummary, writeResurrectionReport } from "../core/reports.js";
import type { WorkspaceOptions } from "../core/workspace.js";
import { resurrect } from "./resurrect.js";
import type { EvidenceSummary } from "../types.js";

export async function evidencePack(path: string, options: { workspace?: WorkspaceOptions } = {}) {
  const result = await resurrect(path, { safe: true, workspace: options.workspace });
  const root = result.before.scan.path;
  const summary: EvidenceSummary = {
    project: "lazarus-mcp",
    version: "0.1.0",
    mvp_scope: ["node", "python"],
    fixtures: [
      {
        name: root.split(/[\\/]/).pop() ?? "target",
        before: {
          install: result.before.beforeMetrics.install,
          build: result.before.beforeMetrics.build,
          test: result.before.beforeMetrics.test
        },
        after: {
          install: result.after.beforeMetrics.install,
          build: result.after.beforeMetrics.build,
          test: result.after.beforeMetrics.test
        },
        appliedFixes: result.appliedFixes.map((fix) => fix.id)
      }
    ],
    externalCaseStudy: null,
    knownLimitations: [
      "MVP supports Node and Python only.",
      "Only high-confidence playbooks are applied automatically.",
      "The MCP adapter is stdio-only."
    ]
  };
  return {
    result,
    files: {
      resurrectionReport: writeResurrectionReport(root, result),
      aiJudges: writeAiJudges(root, result),
      summary: writeEvidenceSummary(root, summary)
    },
    summary
  };
}
