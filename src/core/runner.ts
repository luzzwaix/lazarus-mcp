import { spawn } from "node:child_process";
import type { CommandResult, CommandStage, ScanResult } from "../types.js";
import { classifyFailure } from "./logs.js";
import { truncateLog } from "./safety.js";

interface RunOptions {
  cwd: string;
  stage: CommandStage;
  command: string;
  args: string[];
  timeoutMs?: number;
  env?: NodeJS.ProcessEnv;
}

export async function runCommand(options: RunOptions, scan: ScanResult): Promise<CommandResult> {
  const started = Date.now();
  const timeoutMs = options.timeoutMs ?? 120_000;
  let stdout = "";
  let stderr = "";
  let timedOut = false;

  return await new Promise((resolve) => {
    const useWindowsShell = process.platform === "win32";
    const child = spawn(
      useWindowsShell ? process.env.ComSpec ?? "cmd.exe" : options.command,
      useWindowsShell ? ["/d", "/s", "/c", shellCommand(options.command, options.args)] : options.args,
      {
      cwd: options.cwd,
      env: { ...process.env, ...options.env },
      windowsHide: true
      }
    );

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGTERM");
      setTimeout(() => {
        if (!child.killed) child.kill("SIGKILL");
      }, 1000).unref();
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", (error) => {
      stderr += `\n${error.message}`;
    });
    child.on("close", (exitCode) => {
      clearTimeout(timer);
      const status = exitCode === 0 && !timedOut ? "passed" : "failed";
      const result: CommandResult = {
        stage: options.stage,
        command: [options.command, ...options.args].join(" "),
        status,
        exitCode,
        timedOut,
        durationMs: Date.now() - started,
        stdout: truncateLog(stdout),
        stderr: truncateLog(stderr),
        summary: status === "passed" ? `${options.stage} passed` : `${options.stage} failed`
      };
      if (status === "failed") {
        result.errorClass = classifyFailure(options.stage, result, scan);
      }
      resolve(result);
    });
  });
}

function shellCommand(command: string, args: string[]): string {
  return [command, ...args].map(quoteCmdArg).join(" ");
}

function quoteCmdArg(part: string): string {
  return /^[A-Za-z0-9_./:=@-]+$/.test(part) ? part : `"${part.replace(/"/g, '\\"')}"`;
}

export function skippedCommand(stage: CommandStage, reason: string): CommandResult {
  return {
    stage,
    command: reason,
    status: "skipped",
    exitCode: 0,
    timedOut: false,
    durationMs: 0,
    stdout: "",
    stderr: "",
    summary: reason
  };
}

export function syntheticFailure(
  stage: CommandStage,
  command: string,
  errorClass: CommandResult["errorClass"],
  summary: string
): CommandResult {
  return {
    stage,
    command,
    status: "failed",
    exitCode: 1,
    timedOut: false,
    durationMs: 0,
    stdout: "",
    stderr: summary,
    errorClass,
    summary
  };
}
