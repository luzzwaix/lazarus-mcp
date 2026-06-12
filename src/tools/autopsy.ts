import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { detectRepo } from "../core/detect.js";
import { normalizeLogs, suggestedPlaybooks } from "../core/logs.js";
import { metricsFromCommands } from "../core/metrics.js";
import { runCommand, skippedCommand, syntheticFailure } from "../core/runner.js";
import { resolveWorkspaceTarget, type WorkspaceOptions } from "../core/workspace.js";
import type { AutopsyResult, CommandResult, ErrorClass } from "../types.js";

export interface AutopsyOptions {
  timeoutMs?: number;
  workspace?: WorkspaceOptions;
}

export async function autopsy(path: string, options: AutopsyOptions = {}): Promise<AutopsyResult> {
  const target = await resolveWorkspaceTarget(path, options.workspace);
  return autopsyLocalPath(target.path, options);
}

export async function autopsyLocalPath(path: string, options: AutopsyOptions = {}): Promise<AutopsyResult> {
  const scan = detectRepo(path);
  const timeoutMs = options.timeoutMs ?? 120_000;
  const commands: CommandResult[] = [];

  if (scan.stack === "unsupported" || scan.stack === "mixed") {
    commands.push(syntheticFailure("install", "scan_repo", "unsupported_stack", `Unsupported stack: ${scan.stack}`));
  } else if (scan.stack === "node") {
    commands.push(await runNodeInstall(scan.path, timeoutMs, scan));
    commands.push(await runNodeScript(scan.path, "build", timeoutMs, scan));
    commands.push(await runNodeScript(scan.path, "test", timeoutMs, scan));
  } else {
    commands.push(await runPythonInstall(scan.path, timeoutMs, scan));
    commands.push(await runPythonBuild(scan.path, timeoutMs, scan));
    commands.push(await runPythonTest(scan.path, timeoutMs, scan));
  }

  const failures = commands.filter((command) => command.status === "failed");
  const errorClasses = [...new Set(failures.map((failure) => failure.errorClass).filter(Boolean))] as ErrorClass[];

  return {
    scan,
    commands,
    failStage: failures[0]?.stage ?? null,
    errorClasses,
    suggestedPlaybooks: suggestedPlaybooks(errorClasses, scan),
    beforeMetrics: metricsFromCommands(commands),
    normalizedLogs: normalizeLogs(commands)
  };
}

async function runNodeInstall(root: string, timeoutMs: number, scan: AutopsyResult["scan"]) {
  const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  const hasDeps =
    Object.keys(packageJson.dependencies ?? {}).length > 0 ||
    Object.keys(packageJson.devDependencies ?? {}).length > 0;
  if (!hasDeps) return skippedCommand("install", "npm install skipped: package has no dependencies");
  return await runCommand(
    { cwd: root, stage: "install", command: "npm", args: ["install", "--ignore-scripts"], timeoutMs },
    scan
  );
}

async function runNodeScript(
  root: string,
  scriptName: "build" | "test",
  timeoutMs: number,
  scan: AutopsyResult["scan"]
) {
  if (!scan.scripts[scriptName]) {
    return syntheticFailure(scriptName, `npm run ${scriptName}`, "missing_script", `Missing npm ${scriptName} script`);
  }
  return await runCommand(
    { cwd: root, stage: scriptName, command: "npm", args: ["run", scriptName, "--silent"], timeoutMs },
    scan
  );
}

async function runPythonInstall(root: string, timeoutMs: number, scan: AutopsyResult["scan"]) {
  const requirements = join(root, "requirements.txt");
  if (!existsSync(requirements) || readFileSync(requirements, "utf8").trim() === "") {
    return skippedCommand("install", "pip install skipped: no requirements declared");
  }
  mkdirSync(join(root, ".lazarus-pydeps"), { recursive: true });
  return await runCommand(
    {
      cwd: root,
      stage: "install",
      command: "python",
      args: [
        "-m",
        "pip",
        "install",
        "--disable-pip-version-check",
        "--quiet",
        "--target",
        ".lazarus-pydeps",
        "-r",
        "requirements.txt"
      ],
      timeoutMs
    },
    scan
  );
}

async function runPythonBuild(root: string, timeoutMs: number, scan: AutopsyResult["scan"]) {
  const targets = ["src", "tests"].filter((target) => existsSync(join(root, target)));
  if (targets.length === 0) return skippedCommand("build", "python compile skipped: no src/tests directories");
  return await runCommand(
    { cwd: root, stage: "build", command: "python", args: ["-m", "compileall", "-q", ...targets], timeoutMs },
    scan
  );
}

async function runPythonTest(root: string, timeoutMs: number, scan: AutopsyResult["scan"]) {
  if (!scan.testRunnerHints.includes("pytest")) {
    return skippedCommand("test", "pytest skipped: no pytest hints found");
  }
  const pydeps = join(root, ".lazarus-pydeps");
  return await runCommand(
    {
      cwd: root,
      stage: "test",
      command: "python",
      args: ["-m", "pytest", "-q"],
      timeoutMs,
      env: {
        PYTHONPATH: existsSync(pydeps)
          ? `${pydeps}${process.env.PYTHONPATH ? `${process.platform === "win32" ? ";" : ":"}${process.env.PYTHONPATH}` : ""}`
          : process.env.PYTHONPATH
      }
    },
    scan
  );
}
