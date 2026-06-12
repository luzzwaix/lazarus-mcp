export type SupportedStack = "node" | "python" | "mixed" | "unsupported";

export type ErrorClass =
  | "missing_dependency"
  | "missing_script"
  | "esm_cjs_mismatch"
  | "missing_test_dependency"
  | "unsupported_stack"
  | "command_timeout"
  | "unknown_failure";

export type CommandStage = "install" | "build" | "test";
export type CommandStatus = "passed" | "failed" | "skipped";

export interface CommandResult {
  stage: CommandStage;
  command: string;
  status: CommandStatus;
  exitCode: number | null;
  timedOut: boolean;
  durationMs: number;
  stdout: string;
  stderr: string;
  errorClass?: ErrorClass;
  summary: string;
}

export interface ScanResult {
  path: string;
  stack: SupportedStack;
  packageManager: string | null;
  configFiles: string[];
  scripts: Record<string, string>;
  testRunnerHints: string[];
  confidence: number;
  healthHints: string[];
}

export interface AutopsyResult {
  scan: ScanResult;
  commands: CommandResult[];
  failStage: CommandStage | null;
  errorClasses: ErrorClass[];
  suggestedPlaybooks: string[];
  beforeMetrics: PipelineMetrics;
  normalizedLogs: string[];
}

export interface PipelineMetrics {
  install: CommandStatus;
  build: CommandStatus;
  test: CommandStatus;
  durationMs: number;
}

export interface AppliedFix {
  id: string;
  file: string;
  description: string;
}

export interface ResurrectionResult {
  branchName: string;
  branchCreated: boolean;
  before: AutopsyResult;
  after: AutopsyResult;
  appliedFixes: AppliedFix[];
  changedFiles: string[];
  gitDiffPath: string | null;
}

export interface EvidenceFixtureSummary {
  name: string;
  before: Record<CommandStage, CommandStatus>;
  after: Record<CommandStage, CommandStatus>;
  appliedFixes: string[];
}

export interface EvidenceSummary {
  project: "lazarus-mcp";
  version: string;
  mvp_scope: ["node", "python"];
  fixtures: EvidenceFixtureSummary[];
  externalCaseStudy: null;
  knownLimitations: string[];
}
