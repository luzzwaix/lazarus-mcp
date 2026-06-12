import type { CommandResult, PipelineMetrics } from "../types.js";

export function metricsFromCommands(commands: CommandResult[]): PipelineMetrics {
  const stageStatus = (stage: "install" | "build" | "test") =>
    commands.find((command) => command.stage === stage)?.status ?? "skipped";

  return {
    install: stageStatus("install"),
    build: stageStatus("build"),
    test: stageStatus("test"),
    durationMs: commands.reduce((total, command) => total + command.durationMs, 0)
  };
}

export function isPipelineGreen(metrics: PipelineMetrics): boolean {
  return [metrics.install, metrics.build, metrics.test].every(
    (status) => status === "passed" || status === "skipped"
  );
}
