"use client";

import { motion } from "framer-motion";

type Artifact = {
  name: string;
  href: string;
};

type EvidenceUnlockPanelProps = {
  artifacts: Artifact[];
  unlockedCount: number;
};

export default function EvidenceUnlockPanel({ artifacts, unlockedCount }: EvidenceUnlockPanelProps) {
  return (
    <section className="lab-panel evidence-panel" id="evidence" aria-label="Evidence pack">
      <div className="panel-title-row">
        <div>
          <span className="eyebrow">Evidence pack</span>
          <h2>Artifacts</h2>
        </div>
        <span className={`state-pill ${unlockedCount === artifacts.length ? "state-pill-good" : "state-pill-muted"}`}>
          {unlockedCount}/{artifacts.length} unlocked
        </span>
      </div>

      <div className="artifact-list">
        {artifacts.map((artifact, index) => {
          const unlocked = index < unlockedCount;
          const content = (
            <>
              <span className={`artifact-icon ${unlocked ? "artifact-icon-open" : ""}`}>{unlocked ? "ok" : "lock"}</span>
              <span>{artifact.name}</span>
              <small>{unlocked ? "ready" : "sealed"}</small>
            </>
          );

          return unlocked ? (
            <motion.a
              className="artifact-row is-unlocked"
              href={artifact.href}
              initial={{ opacity: 0.45, x: 10, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.28, delay: index * 0.04 }}
              key={artifact.name}
            >
              {content}
            </motion.a>
          ) : (
            <div className="artifact-row" key={artifact.name}>
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}
