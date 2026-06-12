# Lazarus MCP

Lazarus MCP autopsies broken Node/Python repos, applies safe resurrection playbooks, reruns the pipeline, and writes judge-ready proof.

## Why It Exists

Hackathon judges and maintainers need more than an AI claim. They need evidence: what failed, why it failed, what changed, and whether build/test is green afterward. Lazarus keeps the scope narrow and auditable: local Node and Python repositories only, conservative patches only, no remote pushes.

## Quickstart

```bash
npm install
npm run build
npm test
```

Try a fixture:

```bash
npm run dev -- scan fixtures/dead-node-missing-build
npm run dev -- autopsy fixtures/dead-node-missing-build
npm run dev -- resurrect fixtures/dead-node-missing-build --safe
npm run dev -- evidence-pack fixtures/dead-node-missing-build
```

## CLI Usage

```bash
lazarus scan <path>
lazarus autopsy <path>
lazarus resurrect <path> [--safe] [--branch <name>]
lazarus evidence-pack <path>
```

`scan` detects stack, package manager, config files, scripts, test runner hints, confidence, and health hints. `autopsy` runs safe install/build/test commands with timeouts and structured log classification. `resurrect` applies high-confidence playbooks, reruns the pipeline, and never pushes upstream. `evidence-pack` writes `RESURRECTION_REPORT.md`, `AI_JUDGES.md`, and `evidence/summary.json`.

## MCP Tools

The stdio adapter in `src/server.ts` exposes:

- `scan_repo`
- `autopsy`
- `resurrect`
- `evidence_pack`

The adapter is intentionally thin so the CLI core stays package-agnostic and green if MCP package APIs shift.

## Proof It Works

- `tests/detect.test.ts` covers stack and pytest detection.
- `tests/autopsy.test.ts` covers log classification and missing-script autopsy.
- `tests/resurrect.node.test.ts` resurrects `fixtures/dead-node-esm-cjs` and `fixtures/dead-node-missing-build`.
- `tests/resurrect.python.test.ts` resurrects `fixtures/dead-python-missing-pytest`.
- `tests/report.test.ts` verifies judge evidence generation.
- CI runs `npm install`, `npm run build`, and `npm test`.

## Demo Flow

1. Show a broken fixture repository.
2. Run `lazarus autopsy <path>` and point to the failing phase and error class.
3. Run `lazarus resurrect <path> --safe`.
4. Show after metrics are green.
5. Run `lazarus evidence-pack <path>` and open the generated report files.

## Current MVP Scope

- Supported stacks: Node and Python.
- Supported input: local path.
- Supported Node fixes: missing build script, conservative ESM/CJS package type repair, strongly implied TypeScript dependency.
- Supported Python fixes: missing pytest dependency when tests/config imply pytest.
- No frontend, OAuth, remote HTTP server, broad language support, or remote git push.

## Safety

- Commands time out after 120 seconds by default.
- Logs are redacted for obvious secrets.
- Lazarus never force-pushes, never pushes, and never modifies remotes.
- Low-confidence fixes are reported as suggestions instead of mutations.
- Applied changes are intentionally small and auditable.

## Screenshots / Logs

Terminal demo placeholders live in `docs/DEMO_SCRIPT.md` and `docs/VIDEO_STORYBOARD.md`. The machine-readable run summary lives in `evidence/summary.json`.
