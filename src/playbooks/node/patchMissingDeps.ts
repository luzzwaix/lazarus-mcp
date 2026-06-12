import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { AppliedFix, AutopsyResult } from "../../types.js";

export function patchMissingDeps(root: string, before: AutopsyResult): AppliedFix[] {
  if (!before.errorClasses.includes("missing_dependency")) return [];
  const packagePath = join(root, "package.json");
  if (!existsSync(packagePath) || !existsSync(join(root, "tsconfig.json"))) return [];
  const pkg = JSON.parse(readFileSync(packagePath, "utf8")) as {
    scripts?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  const scripts = Object.values(pkg.scripts ?? {}).join(" ");
  if (!/\btsc\b/.test(scripts)) return [];
  pkg.devDependencies ??= {};
  if (pkg.devDependencies.typescript) return [];
  pkg.devDependencies.typescript = "^5.8.3";
  writeFileSync(packagePath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");
  return [
    {
      id: "node.add_typescript",
      file: "package.json",
      description: "Added TypeScript dev dependency because tsconfig and tsc script are present."
    }
  ];
}
