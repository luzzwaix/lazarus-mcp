import type { AutopsyResult } from "../../types.js";

export function pythonIssueIds(autopsy: AutopsyResult): string[] {
  const issues: string[] = [];
  if (autopsy.errorClasses.includes("missing_test_dependency")) issues.push("python.missing_pytest");
  return issues;
}
