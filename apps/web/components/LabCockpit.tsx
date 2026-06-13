"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import AnimatedTerminal, { type TerminalEntry } from "./AnimatedTerminal";
import BeforeAfterDiff from "./BeforeAfterDiff";
import EvidenceUnlockPanel from "./EvidenceUnlockPanel";
import HealthMeter from "./HealthMeter";
import ResurrectionPipeline, { type PipelineStep } from "./ResurrectionPipeline";

const githubUrl = "https://github.com/luzzwaix/lazarus-mcp";

const steps: PipelineStep[] = [
  { id: "input", label: "INPUT", short: "repo accepted" },
  { id: "scan", label: "SCAN", short: "stack detected" },
  { id: "autopsy", label: "AUTOPSY", short: "failure classified" },
  { id: "patch", label: "PATCH", short: "safe repairs" },
  { id: "verify", label: "VERIFY", short: "checks running" },
  { id: "evidence", label: "EVIDENCE", short: "pack sealed" }
];

const idleLines: TerminalEntry[] = [
  { text: "lazarus lab armed", tone: "muted", group: "idle" },
  { text: "waiting for dead repository", tone: "warn", group: "idle" },
  { text: "autopsy engine online", tone: "muted", group: "idle" },
  { text: "evidence writer standing by", tone: "muted", group: "idle" }
];

const terminalLines: TerminalEntry[] = [
  { text: "lazarus scan https://github.com/luzzwaix/lazarus-mcp", tone: "command", group: "scan" },
  { text: "repo detected: node/typescript", tone: "muted", group: "scan" },
  { text: "dependency rot detected", tone: "bad", group: "autopsy" },
  { text: "build script missing", tone: "bad", group: "autopsy" },
  { text: "tests failing", tone: "bad", group: "autopsy" },
  { text: "safe patch plan generated", tone: "warn", group: "patch" },
  { text: "applying resurrection playbooks", tone: "warn", group: "patch" },
  { text: "install passed", tone: "good", group: "verify" },
  { text: "build passed", tone: "good", group: "verify" },
  { text: "tests passed", tone: "good", group: "verify" },
  { text: "evidence pack generated", tone: "good", group: "evidence" }
];

const stepByLine = [0, 1, 1, 2, 2, 3, 3, 4, 4, 4, 5];
const healthByLine = [12, 20, 27, 34, 42, 52, 63, 75, 84, 90, 94];
const phaseByLine = ["DEAD", "SCAN", "AUTOPSY", "AUTOPSY", "AUTOPSY", "PATCHING", "PATCHING", "VERIFYING", "VERIFYING", "VERIFYING", "REVIVED"];

const artifacts = [
  { name: "RESURRECTION_REPORT.md", href: `${githubUrl}/blob/main/RESURRECTION_REPORT.md` },
  { name: "AI_JUDGES.md", href: `${githubUrl}/blob/main/AI_JUDGES.md` },
  { name: "evidence/summary.json", href: `${githubUrl}/blob/main/evidence/summary.json` },
  { name: "before-after logs", href: `${githubUrl}/tree/main/evidence` }
];

type Phase = "idle" | "running" | "complete";

export default function LabCockpit() {
  const reduced = useReducedMotion();
  const timers = useRef<number[]>([]);
  const [repoUrl, setRepoUrl] = useState(githubUrl);
  const [phase, setPhase] = useState<Phase>("idle");
  const [phaseLabel, setPhaseLabel] = useState("DEAD");
  const [activeStep, setActiveStep] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [health, setHealth] = useState(12);
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [pointer, setPointer] = useState({ x: 62, y: 28 });

  const clearTimers = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  };

  useEffect(() => clearTimers, []);

  const schedule = (callback: () => void, ms: number) => {
    const timer = window.setTimeout(callback, ms);
    timers.current.push(timer);
  };

  const reset = () => {
    clearTimers();
    setPhase("idle");
    setPhaseLabel("DEAD");
    setActiveStep(0);
    setVisibleLines(0);
    setHealth(12);
    setUnlockedCount(0);
  };

  const run = () => {
    clearTimers();
    setPhase("running");
    setPhaseLabel("AUTOPSY");
    setActiveStep(0);
    setVisibleLines(0);
    setHealth(12);
    setUnlockedCount(0);

    if (reduced) {
      setVisibleLines(terminalLines.length);
      setActiveStep(steps.length - 1);
      setHealth(94);
      setUnlockedCount(artifacts.length);
      setPhaseLabel("REVIVED");
      setPhase("complete");
      return;
    }

    let cursor = 160;
    terminalLines.forEach((_, index) => {
      schedule(() => {
        setVisibleLines(index + 1);
        setActiveStep(stepByLine[index]);
        setHealth(healthByLine[index]);
        setPhaseLabel(phaseByLine[index]);
      }, cursor);
      cursor += index < 6 ? 430 : 360;
    });

    cursor += 280;
    artifacts.forEach((_, index) => {
      schedule(() => setUnlockedCount(index + 1), cursor + index * 220);
    });
    schedule(() => {
      setActiveStep(steps.length - 1);
      setHealth(94);
      setPhaseLabel("REVIVED");
      setPhase("complete");
    }, cursor + artifacts.length * 220 + 80);
  };

  const complete = phase === "complete";
  const running = phase === "running";

  return (
    <section
      className={`lab-shell phase-${phaseLabel.toLowerCase()}`}
      id="lab"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setPointer({
          x: ((event.clientX - rect.left) / rect.width) * 100,
          y: ((event.clientY - rect.top) / rect.height) * 100
        });
      }}
      style={{ "--mx": `${pointer.x}%`, "--my": `${pointer.y}%` } as CSSProperties}
    >
      <div className="lab-atmosphere" />
      <div className="lab-header">
        <div>
          <span className="eyebrow">Lazarus Lab</span>
          <h1>Lazarus MCP</h1>
          <p>Dead repo in. Working repo out. Evidence included.</p>
        </div>
        <div className="lab-header-status">
          <span className={`state-pill ${complete ? "state-pill-good" : running ? "state-pill-muted" : "state-pill-bad"}`}>
            {complete ? "resurrection complete" : running ? phaseLabel : "dead repo loaded"}
          </span>
          <a href={githubUrl}>GitHub</a>
        </div>
      </div>

      <div className="cockpit-grid">
        <aside className="cockpit-left">
          <section className="lab-panel control-panel">
            <span className="eyebrow">Repo target</span>
            <label htmlFor="repo-url">Repository URL</label>
            <input
              id="repo-url"
              value={repoUrl}
              onChange={(event) => setRepoUrl(event.target.value)}
              disabled={running}
            />
            <button className={`run-button ${complete ? "is-complete" : ""}`} disabled={running || complete} onClick={run}>
              {complete ? "Resurrection Complete" : running ? "Running..." : "Run Resurrection"}
            </button>
            {complete ? (
              <motion.button
                className="reset-button"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={reset}
              >
                Replay / reset
              </motion.button>
            ) : null}
          </section>
          <HealthMeter target={health} complete={complete} running={running} phaseLabel={phaseLabel} />
        </aside>

        <main className="cockpit-center">
          <div className="autopsy-console">
            <div className="console-topline">
              <span className="eyebrow">Autopsy console</span>
              <div>
                <span className={`state-pill ${complete ? "state-pill-good" : running ? "state-pill-muted" : "state-pill-bad"}`}>{phaseLabel}</span>
                {complete ? <span className="state-pill state-pill-good">4 checks passed</span> : null}
              </div>
            </div>
            <ResurrectionPipeline steps={steps} activeStep={activeStep} complete={complete} running={running} />
            <AnimatedTerminal
              idleLines={idleLines}
              lines={terminalLines}
              visibleCount={visibleLines}
              running={running}
              complete={complete}
              phaseLabel={phaseLabel}
            />
          </div>
          <BeforeAfterDiff complete={complete} />
        </main>

        <aside className="cockpit-right">
          <EvidenceUnlockPanel artifacts={artifacts} unlockedCount={unlockedCount} />
          <section className="lab-panel cockpit-note">
            <span className="eyebrow">Run mode</span>
            <p>Static product demo. No backend, no upstream push, no hidden auth.</p>
          </section>
        </aside>
      </div>
    </section>
  );
}
