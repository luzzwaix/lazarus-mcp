"use client";

import { AnimatePresence, motion } from "framer-motion";

type AnimatedTerminalProps = {
  lines: string[];
  visibleCount: number;
  running: boolean;
};

export default function AnimatedTerminal({ lines, visibleCount, running }: AnimatedTerminalProps) {
  const visibleLines = lines.slice(0, visibleCount);

  return (
    <section className="lab-panel terminal-panel" aria-label="Live Lazarus terminal">
      <div className="terminal-top">
        <div className="window-dots">
          <span />
          <span />
          <span />
        </div>
        <span className="mono">lazarus lab / live terminal</span>
      </div>
      <div className="terminal-body">
        <AnimatePresence initial={false}>
          {visibleLines.map((line, index) => {
            const tone = line.includes("passed") || line.includes("generated") ? "line-good" : line.includes("rot") || line.includes("missing") || line.includes("failing") ? "line-bad" : "";
            return (
              <motion.div
                className={`terminal-line ${tone}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                key={`${line}-${index}`}
              >
                <span className="prompt">{index === 0 ? "$" : ">"}</span>
                <span>{line}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <span className={`cursor ${running ? "is-running" : ""}`} />
      </div>
    </section>
  );
}
