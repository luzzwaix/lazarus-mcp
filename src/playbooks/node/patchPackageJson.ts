import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { AppliedFix, AutopsyResult } from "../../types.js";

export function patchPackageJson(root: string, before: AutopsyResult): AppliedFix[] {
  const packagePath = join(root, "package.json");
  if (!existsSync(packagePath)) return [];
  const pkg = JSON.parse(readFileSync(packagePath, "utf8")) as {
    scripts?: Record<string, string>;
  };
  pkg.scripts ??= {};
  const fixes: AppliedFix[] = [];

  if (before.errorClasses.includes("missing_script") && !pkg.scripts.build) {
    const target = existsSync(join(root, "src", "index.js"))
      ? "src/index.js"
      : existsSync(join(root, "index.js"))
        ? "index.js"
        : null;
    if (target) {
      pkg.scripts.build = `node --check ${target}`;
      fixes.push({
        id: "node.add_build_script",
        file: "package.json",
        description: `Added conservative build script: node --check ${target}`
      });
    }
  }

  if (fixes.length > 0) {
    writeFileSync(packagePath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");
  }
  return fixes;
}
