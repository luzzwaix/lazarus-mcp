import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { AppliedFix, AutopsyResult } from "../../types.js";

export function patchEsmCjs(root: string, before: AutopsyResult): AppliedFix[] {
  if (!before.errorClasses.includes("esm_cjs_mismatch")) return [];
  const packagePath = join(root, "package.json");
  if (!existsSync(packagePath)) return [];
  const pkg = JSON.parse(readFileSync(packagePath, "utf8")) as { type?: string };
  if (pkg.type !== "module") return [];
  if (projectUsesEsmSyntax(root)) return [];
  pkg.type = "commonjs";
  writeFileSync(packagePath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");
  return [
    {
      id: "node.type_commonjs",
      file: "package.json",
      description: "Switched package type from module to commonjs because files use require/module syntax."
    }
  ];
}

function projectUsesEsmSyntax(root: string): boolean {
  const files = listJavaScriptFiles(root);
  return files.some((file) => /\b(import|export)\s/.test(readFileSync(file, "utf8")));
}

function listJavaScriptFiles(root: string): string[] {
  const ignored = new Set(["node_modules", "dist", ".git"]);
  const files: string[] = [];
  const visit = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      if (ignored.has(entry)) continue;
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) visit(fullPath);
      if (stat.isFile() && /\.(js|cjs|mjs)$/.test(entry)) files.push(fullPath);
    }
  };
  visit(root);
  return files;
}
