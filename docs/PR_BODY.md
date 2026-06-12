# Summary

Implements the Lazarus MCP MVP: a CLI-first TypeScript autopsy/resurrection engine with a thin stdio MCP adapter, deterministic fixtures, tests, CI, and judge evidence.

# What Works Now

- Detects Node and Python repos.
- Runs install/build/test autopsy with timeout and log classification.
- Repairs conservative Node ESM/CJS mismatches.
- Adds missing Node build scripts when the entry point is obvious.
- Adds pytest to Python requirements when tests/config clearly require it.
- Generates `RESURRECTION_REPORT.md`, `AI_JUDGES.md`, and `evidence/summary.json`.

# Evidence

- `npm run build`
- `npm test`
- `fixtures/dead-node-esm-cjs`
- `fixtures/dead-node-missing-build`
- `fixtures/dead-python-missing-pytest`
- `tests/`
- `evidence/summary.json`

# Limitations

- Node and Python only.
- Local path input only for MVP.
- stdio MCP adapter only.
- No remote push, no frontend, no OAuth, no broad auto-repair.

# Next Milestone

Add one external Node/Python case study and record a 60-90 second terminal demo using `docs/DEMO_SCRIPT.md`.
