import type { AutopsyResult } from "../../types.js";

export function nodeIssueIds(autopsy: AutopsyResult): string[] {
  const issues: string[] = [];
  if (autopsy.errorClasses.includes("missing_script")) issues.push("node.missing_script");
  if (autopsy.errorClasses.includes("esm_cjs_mismatch")) issues.push("node.esm_cjs_mismatch");
  if (autopsy.errorClasses.includes("missing_dependency")) issues.push("node.missing_dependency");
  return issues;
}
