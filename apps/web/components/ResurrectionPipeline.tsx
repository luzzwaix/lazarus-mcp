"use client";

import { motion } from "framer-motion";

export type PipelineStep = {
  id: string;
  label: string;
  short: string;
};

type ResurrectionPipelineProps = {
  steps: PipelineStep[];
  activeStep: number;
  complete: boolean;
  running: boolean;
};

export default function ResurrectionPipeline({ steps, activeStep, complete, running }: ResurrectionPipelineProps) {
  const progress = complete ? 100 : steps.length > 1 ? (activeStep / (steps.length - 1)) * 100 : 0;

  return (
    <section className={`lab-panel pipeline-panel ${running ? "is-running" : ""} ${complete ? "is-complete" : ""}`} aria-label="Resurrection pipeline">
      <div className="panel-title-row">
        <div>
          <span className="eyebrow">Resurrection pipeline</span>
          <h2>INPUT to EVIDENCE</h2>
        </div>
        <span className={`state-pill ${complete ? "state-pill-good" : running ? "state-pill-muted" : "state-pill-bad"}`}>
          {complete ? "verified" : running ? "sweeping" : "armed"}
        </span>
      </div>

      <div className="pipeline-track">
        <div className="pipeline-rail">
          <motion.div
            className="pipeline-progress"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          />
          {running ? (
            <motion.div
              className="pipeline-beam"
              animate={{ x: ["-20%", "420%"] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : null}
        </div>
        <div className="pipeline-steps">
          {steps.map((step, index) => {
            const done = index < activeStep || complete;
            const active = index === activeStep && !complete;
            return (
              <motion.div
                className={`pipeline-node ${done ? "is-done" : ""} ${active ? "is-active" : ""}`}
                key={step.id}
                animate={{ opacity: done || active ? 1 : 0.48, y: active ? -3 : 0, scale: active ? 1.03 : 1 }}
                transition={{ duration: 0.28 }}
              >
                <div className="node-orb">{done ? "ok" : index + 1}</div>
                <strong>{step.label}</strong>
                <span>{done ? "complete" : active ? step.short : "queued"}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
