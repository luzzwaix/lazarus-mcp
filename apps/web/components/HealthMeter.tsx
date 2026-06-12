"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

type HealthMeterProps = {
  target: number;
  complete: boolean;
  running: boolean;
};

function useCountTo(target: number) {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(target);

  useEffect(() => {
    if (reduced) {
      setValue(target);
      return;
    }

    let frame = 0;
    const start = value;
    const diff = target - start;
    const totalFrames = 24;
    const timer = window.setInterval(() => {
      frame += 1;
      const eased = 1 - Math.pow(1 - frame / totalFrames, 3);
      setValue(Math.round(start + diff * eased));
      if (frame >= totalFrames) window.clearInterval(timer);
    }, 24);

    return () => window.clearInterval(timer);
  }, [target, reduced]);

  return value;
}

export default function HealthMeter({ target, complete, running }: HealthMeterProps) {
  const value = useCountTo(target);
  const circumference = 2 * Math.PI * 46;
  const offset = circumference - (circumference * value) / 100;
  const dead = value < 40;

  return (
    <section className={`lab-panel health-card ${complete ? "is-revived" : running ? "is-running" : "is-dead"}`}>
      <span className="eyebrow">Repo health</span>
      <div className="health-layout">
        <div className="health-ring" aria-label={`Repository health ${value}%`}>
          <svg viewBox="0 0 112 112" role="img">
            <circle cx="56" cy="56" r="46" className="ring-bg" />
            <motion.circle
              cx="56"
              cy="56"
              r="46"
              className={dead ? "ring-dead" : "ring-live"}
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </svg>
          <div>
            <strong>{value}%</strong>
            <span>{complete ? "REVIVED" : dead ? "DEAD" : "RECOVERING"}</span>
          </div>
        </div>
        <div className="health-meta">
          <p>{complete ? "Install, build, tests, and evidence are green." : running ? "Resurrection sequence in progress." : "Initial autopsy state: repo is unstable."}</p>
          <span className={`state-pill ${complete ? "state-pill-good" : dead ? "state-pill-bad" : "state-pill-muted"}`}>
            {complete ? "REVIVED" : dead ? "DEAD" : "PATCHING"}
          </span>
        </div>
      </div>
    </section>
  );
}
