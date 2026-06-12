"use client";

import { motion } from "framer-motion";

type BeforeAfterDiffProps = {
  complete: boolean;
};

const before = ["npm install failed", "build failed", "tests failed"];
const after = ["npm install passed", "build passed", "tests passed", "evidence generated"];

export default function BeforeAfterDiff({ complete }: BeforeAfterDiffProps) {
  return (
    <section className="lab-panel mini-diff" aria-label="Before and after diff">
      <div className="panel-title-row">
        <div>
          <span className="eyebrow">Before / after</span>
          <h2>{complete ? "Verified output" : "Failure snapshot"}</h2>
        </div>
        <span className={`state-pill ${complete ? "state-pill-good" : "state-pill-bad"}`}>
          {complete ? "after" : "before"}
        </span>
      </div>
      <div className="diff-split">
        <div className={complete ? "diff-muted" : "diff-live diff-before"}>
          {before.map((row) => (
            <p key={row}><span>-</span>{row}</p>
          ))}
        </div>
        <motion.div className={complete ? "diff-live diff-after" : "diff-muted"} animate={{ opacity: complete ? 1 : 0.42 }}>
          {after.map((row, index) => (
            <motion.p
              animate={{ x: complete ? 0 : 4 }}
              transition={{ delay: complete ? index * 0.05 : 0 }}
              key={row}
            >
              <span>+</span>{row}
            </motion.p>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
