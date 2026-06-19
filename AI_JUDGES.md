# AI Judges

Lazarus MCP is a CLI-first TypeScript project plus a thin stdio MCP adapter. It scans local Node/Python repos, runs install/build/test autopsy, classifies failures, applies conservative playbooks, reruns the pipeline, and generates judge-readable evidence.

## Main Evidence

- `README.md`: quickstart, CLI, MCP tools, demo flow, scope, and safety.
- `tests/`: detector, autopsy, resurrection, and report coverage.
- `fixtures/`: three deterministic broken repos used by tests.
- `RESURRECTION_REPORT.md`: before/after narrative and limitations.
- `evidence/summary.json`: machine-readable judge pack.
- `docs/JUDGE_GUIDE.md`: 60-second verification path and clear demo boundaries.
- GitHub Actions: public independent build/test history.
- Lazarus Lab: deployed interactive product simulation.

## Fixture Proof

- `fixtures/dead-node-esm-cjs`: fails from ESM/CJS mismatch, fixed by conservative package type patch.
- `fixtures/dead-node-missing-build`: fails from missing build script, fixed when entry point is obvious.
- `fixtures/dead-python-missing-pytest`: fails from missing pytest dependency, fixed by adding `pytest>=8.0.0` to requirements.

## Metrics Location

Before/after command states are returned by `lazarus resurrect <path> --safe` and written by `lazarus evidence-pack <path>` into `RESURRECTION_REPORT.md` and `evidence/summary.json`.

## Known MVP Limitations

- Node and Python only.
- Local path and GitHub HTTPS URL input are supported.
- MCP is stdio-only.
- The deployed web UI is a static simulation and does not execute repositories.
- No OAuth, remote HTTP MCP transport, Rust/Go/Java/mobile support, or speculative broad auto-repair.
