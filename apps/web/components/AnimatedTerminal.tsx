"use client";

import { AnimatePresence, motion } from "framer-motion";

export type TerminalEntry = {
  text: string;
  tone?: "command" | "bad" | "warn" | "good" | "muted";
  group?: string;
};

type AnimatedTerminalProps = {
  idleLines: TerminalEntry[];
  lines: TerminalEntry[];
  visibleCount: number;
  running: boolean;
  complete: boolean;
  phaseLabel: string;
};

export default function AnimatedTerminal({ idleLines, lines, visibleCount, running, complete, phaseLabel }: AnimatedTerminalProps) {
  const visibleLines = visibleCount > 0 ? lines.slice(0, visibleCount) : idleLines;

  return (
    <section className="lab-panel terminal-panel" aria-label="Live Lazarus terminal">
      <div className="terminal-top">
        <div className="window-dots">
          <span />
          <span />
          <span />
        </div>
        <div className="terminal-header-copy">
          <span className="mono">lazarus lab / live terminal</span>
          <small>branch: lazarus/resurrection</small>
        </div>
        <div className="terminal-chip-row">
          <span className={`state-pill ${complete ? "state-pill-good" : running ? "state-pill-muted" : "state-pill-bad"}`}>
            {phaseLabel}
          </span>
          <span className="terminal-path">/repo/autopsy</span>
        </div>
      </div>
      <div className="terminal-body">
        <AnimatePresence initial={false}>
          {visibleLines.map((line, index) => {
            const tone = line.tone ? `line-${line.tone}` : "";
            const groupChanged = index > 0 && visibleLines[index - 1]?.group !== line.group;
            return (
              <div key={`${line.text}-${index}`}>
                {groupChanged ? <div className="terminal-group-rule" /> : null}
                <motion.div
                  className={`terminal-line ${tone}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  <span className="prompt">{line.tone === "command" ? "$" : ">"}</span>
                  <span>{line.text}</span>
                </motion.div>
              </div>
            );
          })}
        </AnimatePresence>
        {complete ? (
          <motion.div
            className="completion-summary"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <strong>RESURRECTION COMPLETE</strong>
            <div>
              <span>3 failures classified</span>
              <span>4 checks passed</span>
              <span>evidence pack generated</span>
            </div>
          </motion.div>
        ) : visibleCount === 0 ? (
          <motion.div
            className="terminal-standby"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: 0.12 }}
          >
            <div>
              <span>Standby loop</span>
              <strong>Static frontend simulation armed</strong>
            </div>
            <small>Run Resurrection streams the autopsy, patch, verify, and evidence sequence.</small>
          </motion.div>
        ) : null}
        <span className={`cursor ${running ? "is-running" : ""}`} />
      </div>
    </section>
  );
}
