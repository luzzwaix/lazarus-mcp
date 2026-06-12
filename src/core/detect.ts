import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join } from "node:path";
import type { ScanResult } from "../types.js";
import { resolveTargetPath } from "./safety.js";

const CONFIG_FILES = [
  "package.json",
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "tsconfig.json",
  "pyproject.toml",
  "requirements.txt",
  "setup.py",
  "pytest.ini",
  ".github/workflows/ci.yml"
];

export function detectRepo(inputPath: string): ScanResult {
  const root = resolveTargetPath(inputPath);
  const configFiles = CONFIG_FILES.filter((file) => existsSync(join(root, file)));
  const hasPackageJson = configFiles.includes("package.json");
  const hasPythonConfig = configFiles.some((file) =>
    ["pyproject.toml", "requirements.txt", "setup.py", "pytest.ini"].includes(file)
  );
  const pythonFiles = findFiles(root, (file) => file.endsWith(".py"), 40);
  const jsFiles = findFiles(root, (file) => /\.(mjs|cjs|js|ts)$/.test(file), 40);

  const scripts = hasPackageJson ? readPackageScripts(join(root, "package.json")) : {};
  const packageManager = hasPackageJson ? detectPackageManager(root) : hasPythonConfig ? "pip" : null;
  const testRunnerHints = detectTestHints(root, scripts, hasPythonConfig, pythonFiles);
  const nodeScore = (hasPackageJson ? 0.65 : 0) + (jsFiles.length > 0 ? 0.2 : 0);
  const pythonScore = (hasPythonConfig ? 0.65 : 0) + (pythonFiles.length > 0 ? 0.2 : 0);
  const stack =
    nodeScore >= 0.65 && pythonScore >= 0.65
      ? "mixed"
      : nodeScore >= 0.65
        ? "node"
        : pythonScore >= 0.65
          ? "python"
          : "unsupported";
  const confidence = Math.min(1, Math.max(nodeScore, pythonScore));
  const healthHints = [
    ...(hasPackageJson && !scripts.build ? ["node package has no build script"] : []),
    ...(hasPackageJson && !scripts.test ? ["node package has no test script"] : []),
    ...(hasPythonConfig && testRunnerHints.includes("pytest") && !requirementsInclude(root, "pytest")
      ? ["pytest implied but not declared"]
      : []),
    ...(stack === "unsupported" ? ["no supported Node/Python project markers found"] : [])
  ];

  return {
    path: root,
    stack,
    packageManager,
    configFiles,
    scripts,
    testRunnerHints,
    confidence: Number(confidence.toFixed(2)),
    healthHints
  };
}

function readPackageScripts(packagePath: string): Record<string, string> {
  try {
    const parsed = JSON.parse(readFileSync(packagePath, "utf8")) as {
      scripts?: Record<string, string>;
    };
    return parsed.scripts ?? {};
  } catch {
    return {};
  }
}

function detectPackageManager(root: string): string {
  const packageJson = join(root, "package.json");
  try {
    const parsed = JSON.parse(readFileSync(packageJson, "utf8")) as { packageManager?: string };
    if (parsed.packageManager) return parsed.packageManager.split("@")[0] ?? parsed.packageManager;
  } catch {
    return "npm";
  }
  if (existsSync(join(root, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(root, "yarn.lock"))) return "yarn";
  return "npm";
}

function detectTestHints(
  root: string,
  scripts: Record<string, string>,
  hasPythonConfig: boolean,
  pythonFiles: string[]
): string[] {
  const hints = new Set<string>();
  const scriptText = Object.values(scripts).join(" ");
  if (/vitest/i.test(scriptText)) hints.add("vitest");
  if (/jest/i.test(scriptText)) hints.add("jest");
  if (/node\s+--test/i.test(scriptText)) hints.add("node:test");
  if (hasPythonConfig && (existsSync(join(root, "pytest.ini")) || /pytest/i.test(scriptText))) {
    hints.add("pytest");
  }
  if (pythonFiles.some((file) => basename(file).startsWith("test_") || file.includes(`${sep()}tests${sep()}`))) {
    hints.add("pytest");
  }
  return [...hints];
}

function requirementsInclude(root: string, name: string): boolean {
  const requirements = join(root, "requirements.txt");
  if (!existsSync(requirements)) return false;
  return new RegExp(`^\\s*${name}\\b`, "im").test(readFileSync(requirements, "utf8"));
}

function findFiles(root: string, predicate: (file: string) => boolean, limit: number): string[] {
  const found: string[] = [];
  const ignored = new Set(["node_modules", "dist", ".git", ".lazarus-pydeps", "__pycache__"]);
  const visit = (dir: string) => {
    if (found.length >= limit) return;
    for (const entry of readdirSync(dir)) {
      if (ignored.has(entry)) continue;
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) visit(fullPath);
      if (stat.isFile() && predicate(fullPath)) found.push(fullPath);
      if (found.length >= limit) return;
    }
  };
  visit(root);
  return found;
}

function sep(): string {
  return process.platform === "win32" ? "\\" : "/";
}
