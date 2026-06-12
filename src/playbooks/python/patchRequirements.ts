import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { AppliedFix, AutopsyResult } from "../../types.js";

export function patchRequirements(root: string, before: AutopsyResult): AppliedFix[] {
  if (!before.errorClasses.includes("missing_test_dependency")) return [];
  if (!before.scan.testRunnerHints.includes("pytest")) return [];
  const requirementsPath = join(root, "requirements.txt");
  const current = existsSync(requirementsPath) ? readFileSync(requirementsPath, "utf8") : "";
  if (/^\s*pytest\b/im.test(current)) return [];
  const next = `${current.trimEnd()}${current.trim() ? "\n" : ""}pytest>=8.0.0\n`;
  writeFileSync(requirementsPath, next, "utf8");
  return [
    {
      id: "python.add_pytest_requirement",
      file: "requirements.txt",
      description: "Added pytest because tests/config clearly require the pytest runner."
    }
  ];
}
