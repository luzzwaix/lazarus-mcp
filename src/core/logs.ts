import type { CommandResult, CommandStage, ErrorClass, ScanResult } from "../types.js";
import { truncateLog } from "./safety.js";

export function classifyFailure(
  stage: CommandStage,
  result: Pick<CommandResult, "stdout" | "stderr" | "timedOut" | "command">,
  scan: ScanResult
): ErrorClass {
  if (result.timedOut) return "command_timeout";
  if (scan.stack === "unsupported") return "unsupported_stack";

  const logs = `${result.stdout}\n${result.stderr}`;
  if (/Missing script|missing script|npm error Missing script/i.test(logs)) {
    return "missing_script";
  }
  if (
    /require is not defined in ES module scope|ERR_REQUIRE_ESM|Cannot use import statement outside a module|module is not defined in ES module scope/i.test(
      logs
    )
  ) {
    return "esm_cjs_mismatch";
  }
  if (/No module named pytest|pytest: command not found|No module named 'pytest'/i.test(logs)) {
    return "missing_test_dependency";
  }
  if (
    /Cannot find module|ERR_MODULE_NOT_FOUND|ModuleNotFoundError|ImportError|No module named/i.test(
      logs
    )
  ) {
    return stage === "test" && scan.stack === "python"
      ? "missing_test_dependency"
      : "missing_dependency";
  }
  return "unknown_failure";
}

export function normalizeLogs(results: CommandResult[]): string[] {
  return results
    .filter((result) => result.status === "failed")
    .map((result) => {
      const raw = `${result.command}\n${result.stdout}\n${result.stderr}`.trim();
      return `[${result.stage}] ${truncateLog(raw, 1200)}`;
    });
}

export function suggestedPlaybooks(errorClasses: ErrorClass[], scan: ScanResult): string[] {
  const suggestions = new Set<string>();
  for (const errorClass of errorClasses) {
    if (errorClass === "missing_script" && scan.stack === "node") {
      suggestions.add("node.patchPackageJson");
    }
    if (errorClass === "esm_cjs_mismatch" && scan.stack === "node") {
      suggestions.add("node.patchEsmCjs");
    }
    if (errorClass === "missing_dependency" && scan.stack === "node") {
      suggestions.add("node.patchMissingDeps");
    }
    if (errorClass === "missing_test_dependency" && scan.stack === "python") {
      suggestions.add("python.patchRequirements");
    }
  }
  if (scan.stack === "unsupported") suggestions.add("manual.unsupportedStack");
  return [...suggestions];
}
