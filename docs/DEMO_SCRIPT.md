# Demo Script

## 0:00-0:10 - Broken Repo

Open `fixtures/dead-node-esm-cjs/package.json` and `index.js`. Point out that the package declares ESM but the entry file uses `require`.

## 0:10-0:25 - Autopsy

Run:

```bash
npm run dev -- autopsy fixtures/dead-node-esm-cjs
```

Show `failStage`, `esm_cjs_mismatch`, and `node.patchEsmCjs`.

## 0:25-0:45 - Resurrection

Run:

```bash
npm run dev -- resurrect fixtures/dead-node-esm-cjs --safe
```

Show the applied fix and after metrics.

## 0:45-1:05 - Evidence

Run:

```bash
npm run dev -- evidence-pack fixtures/dead-node-esm-cjs
```

Open the generated `RESURRECTION_REPORT.md`, `AI_JUDGES.md`, and `evidence/summary.json`.

## 1:05-1:20 - Closing Pitch

Lazarus MCP autopsies dead repos, revives common Node/Python failures, and generates judge-ready proof.
